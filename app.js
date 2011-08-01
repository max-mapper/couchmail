var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/couchmail'
  , rewrites: 
    [ {from:"/", to:'index.html'}
    , {from:"cache.manifest", to:'_show/cache'}
    , {from:"favicon.png", to:'favicon.ico'}
    , {from:"/api/mail_search", to:"../../../_search/couch-user-mail/couch-user-mail/_search"} // elasticsearch
    , {from:"/api/irc_search", to:"../../../_search/couch-irc-logs/couch-irc-logs/_search"} // elasticsearch
    , {from:"/api", to:'../../'}    
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  , shows: {
      cache: function(head, req) {
        var manifest = "";
        for (var a in this._attachments) {
          manifest += ("/" + a + "\n");
        }
        var r =
          { "headers": { "Content-Type": "text/cache-manifest"}
          , "body": "CACHE MANIFEST\n" + manifest
          }
        return r;
      }
    }
  }
  ;

ddoc.views = {
  by_date: {
    map: function(doc) {
      if (doc.headers && doc.headers.date) {
        var date = JSON.stringify(new Date(doc.headers.date[0]));
        var message = {
          subject: doc.headers.subject[0],
          date: date,
          body: doc.bodytext,
          from: doc.headers.from[0]
        }
        if (doc.parts && doc.parts.length > 0) {
          for (var i = 0; i < doc.parts.length; i++) {
            if (JSON.stringify(doc.parts[i].headers).match("text/html")) message.body = doc.parts[i].bodytext;
          }
        }
        if (doc.headers['message-id']) message.messageId = doc.headers['message-id'][0];
        if (doc.headers.references) message.references = doc.headers.references[0];

        emit(date, message);
      }
    }
  }
};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {     
    throw "Only admin can delete documents on this database.";
  } 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;