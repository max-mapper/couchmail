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
  
  function search(term, filter, options) {
    var postData = {
      "fields": ["bodytext", "_id", "subject"],
      "size": 5,
      "query" : {
        "query_string" : {
          "fields" : ["bodytext"],
          "query" : term
        }
      }
    };
    if (filter) {
      postData.filter = {
        "query" : filter,
        "_cache" : true
      };
    }
    var qs = options ? '?'+$.param(options) : '';
    return $.ajax({
      url: app.config.baseURL + "api/search" + qs,
      type: "POST",
      dataType: "json",
      data: JSON.stringify(postData),
      dataFilter: function(data) {
        data = JSON.parse(data);
        var hits = $.map( data.hits.hits, function( item ) { return item.fields });
        return JSON.stringify(hits);
      }
    }).promise();
  }
  
  function bindAutocomplete(input, filter) {
    input.keyup(function() {
      input.siblings('.loading').show();
      util.delay(function() {
        util.search(input.val(), filter).then(function(results) {
          input.siblings('.loading').hide();
          util.render('searchResults', 'search-list', {results: results});
        });
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
    bindAutocomplete: bindAutocomplete,
    delay: delay
  };
}();