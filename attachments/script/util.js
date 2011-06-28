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
    if ( ! options ) options = {data: {}};
    var html = $.mustache( $( "#" + template + "Template" ).html(), options.data ),
        targetDom = $( "#" + target );
    if( options.append ) {
      targetDom.append( html );
    } else {
      targetDom.html( html );
    }
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
      app.messages[message.id] = message.value;
    })
    
    app.thread = mail.messageThread().thread(_.keys(app.messages).map(
      function(message) { 
        var id = message;
        var message = app.messages[id];
        return mail.message(message.subject, message.messageId, id, message.references);
      }
    ));
  }
  
  return {
    Emitter:Emitter,
    inURL: inURL,
    render: render,
    formatMetadata:formatMetadata,
    getBaseURL:getBaseURL,
    threadMessages: threadMessages
  };
}();