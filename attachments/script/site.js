var app = {
  messages: [],
  container: '#wrapper',
  site: {config:{}}, 
  emitter: new util.Emitter(),
  config: {
  	baseURL: util.getBaseURL(document.location.pathname)
  }
};

app.handler = function(route) {
  if (route.params && route.params.route) {
    var path = route.params.route;
    app.after[path](route.params.id);
  } else {
    app.after['home']();
  }  
};

app.after = {
  home: function() {    
    msg.latest().then(function(messages) {
      var firsts = app.thread.children.map(function(child) {
        if (child.message) {
          return child.message;
        } else if (child.children.length > 0) {
          return child.children[0].message;
        }
      })
      util.render('messages', 'messages', {data: {messages: firsts}});
      app.after['messages']();
    })
  },
  messages: function() {
    $( '.timeago' ).timeago();
    $('.convSummary').click(function(e) {
      $('.highlight').removeClass('highlight');
      $(this).addClass('highlight');
      window.location = "#conversation/" + $(e.target).attr('data-id');
      e.preventDefault();
    })
  },
  conversation: function(messageMD5) {
    function renderConversation() {
      var conversation = app.thread.getConversation(messageMD5);
      conversation = conversation.map(function(message) {
        return app.messages[message.md5];
      })
      if (conversation) util.render('conversation', 'convDisplay', {data: {subject: conversation[0].subject, messages: conversation}});
    }
    if (app.thread) {
      renderConversation();
    } else {
      msg.latest().then(function(messages) {
        renderConversation();
      })
    }
  }
}

app.s = $.sammy(function () {
  this.get('', app.handler);
  this.get("#/", app.handler);
  this.get("#:route", app.handler);
  this.get("#:route/:id", app.handler);
});

$(function() {
  app.s.run();  
})