var util = function() {

  var Emitter = function(obj) {
    this.emit = function(obj) { this.trigger('data', obj); };
  };
  MicroEvent.mixin(Emitter);

  $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name]) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
  };

  function inURL(url, str) {
    var exists = false;
    if ( url.indexOf( str ) > -1 ) {
      exists = true;
    }
    return exists;
  }

  function render( template, target, options ) {
    if ( !options ) options = {data: {}};
    if ( !options.data ) options = {data: options};
    var html = $.mustache( $( "#" + template + "Template" ).html(), options.data ),
        targetDom = $( "#" + target );
    if( options.append ) {
      targetDom.append( html );
    } else {
      targetDom.html( html );
    }
    if (template in app.after) app.after[template]();
  }

  function formatMetadata(data) {
    out = '<dl>';
    $.each(data, function(key, val) {
      if (typeof(val) == 'string' && key[0] != '_') {
        out = out + '<dt>' + key + '<dd>' + val;
      } else if (typeof(val) == 'object' && key != "geometry" && val != null) {
        if (key == 'properties') {
          $.each(val, function(attr, value){
            out = out + '<dt>' + attr + '<dd>' + value;
          })
        } else {
          out = out + '<dt>' + key + '<dd>' + val.join(', ');
        }
      }
    });
    out = out + '</dl>';
    return out;
  }
  
  function plaintextToHTML(body) {
    var lines = body.split(/\n/);
    return _.map(lines, function(line) {
      return $.trim(line);
    }).join('<br>\n');
  }

  function getBaseURL(url) {
    var baseURL = "";
    if ( inURL(url, '_design') ) {
      if (inURL(url, '_rewrite')) {
        var path = url.split("#")[0];
        if (path[path.length - 1] === "/") {
          baseURL = "";
        } else {
          baseURL = '_rewrite/';
        }
      } else {
        baseURL = '_rewrite/';
      }
    }
    return baseURL;
  }
  
  function threadMessages(messages) {
    app.messages = {};
    messages.rows.map(function(message) {
      app.messages[message.value.messageId] = message.value;
    })
    
    return mail.messageThread().thread(_.keys(app.messages).map(
      function(message) { 
        var message = app.messages[message];
        return mail.message(message.subject, message.messageId, message.references);
      }
    ));
  }
  
  function search(term, route, fields) {
    if (!fields) fields = [];
    var returnFields = _.clone(fields);
    returnFields = returnFields.concat(['_id', 'date']);
    var postData = {
      "fields": returnFields,
      "size": 20,
      "query" : {
        "query_string" : {
          "fields" : fields,
          "query" : term
        }
      }
    };
    return $.ajax({
      url: app.config.baseURL + "api/" + route,
      type: "POST",
      dataType: "json",
      data: JSON.stringify(postData),
      dataFilter: function(data) {
        data = JSON.parse(data);
        var hits = $.map( data.hits.hits, function( item ) { return item.fields });
        return JSON.stringify(hits);
      }
    });
  }
  
  siblings = {
    irc: function(message) {
      var dfd = $.Deferred();
      var url = app.config.baseURL + "api/irc/_all_docs?" + $.param({"include_docs": true, "limit": 20, "startkey": '"' + message._id + '"'});
      couch.get(url).then(function(messages) {
        var messages = _.map(messages.rows, function(row) {
          return row.doc;
        });
        dfd.resolve(messages);        
      })
      return dfd.promise();
    },
    mail: function(message) {
      var dfd = $.Deferred();
      var url = app.config.baseURL + "api/mail/_all_docs?" + $.param({"include_docs": true, "limit": 1, "startkey": '"' + message._id + '"'});
      couch.get(url).then(function(messages) {
        var messages = _.map(messages.rows, function(row) {
          var doc = row.doc;
          return {
            from: doc.headers.from[0],
            body: doc.parts[0].bodytext.replace(/\n/ig, '<br>'),
            date: doc.headers.date[0]
          };
        });
        dfd.resolve(messages);      
      })
      return dfd.promise();
    }
  }
  
  var searchRoutes = {
    mail_search: ["bodytext", "subject"],
    irc_search: ["message"]
  }
  
  function bindAutocomplete(input) {
    input.keyup(function() {
      var currentResults = [];
      input.siblings('.loading').show();
      util.delay(function() {
        var searchRoute = input.attr('data-route')
          , term = input.val()
          ;
        function showResults(results, type) {
          results = _.map(results, function(result) {
            var o = {};
            o[type] = [result];
            if (_.isArray(o[type][0].date)) o[type][0].date = o[type][0].date[0]; // todo ugh
            o.sortKey = o[type][0].date; // for easier sorting later
            return o;
          })
          currentResults = currentResults.concat(results);
          currentResults = _.sortBy(currentResults, function(result) {
            return result.sortKey;
          }).reverse()
          util.render('searchResults', 'search-list', {results: currentResults});          
        }
        var requests = _.map(_.keys(searchRoutes), function(route) {
          var req = util.search(term, route, searchRoutes[route])
          req.then(function(results) {
            var type = route.split('_')[0];
            showResults(results, type);
          })
          return req;
        })
        $.when.call(requests)
        .done(function() {
          input.siblings('.loading').hide();
        })
      }, 1000)();
    });
  }
  
  // simple debounce adapted from underscore.js
  function delay(func, wait) {
    return function() {
      var context = this, args = arguments;
      var throttler = function() {
        delete app.timeout;
        func.apply(context, args);
      };
      if (!app.timeout) app.timeout = setTimeout(throttler, wait);      
    };
  };
  
  return {
    Emitter:Emitter,
    inURL: inURL,
    render: render,
    formatMetadata:formatMetadata,
    plaintextToHTML: plaintextToHTML,
    getBaseURL:getBaseURL,
    threadMessages: threadMessages,
    search: search,
    siblings: siblings,
    bindAutocomplete: bindAutocomplete,
    delay: delay
  };
}();