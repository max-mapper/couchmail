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
    util.bindAutocomplete($('#search'))   
    // msg.latest().then(function(conversations) {
    //   console.log(conversations)
    //   var firsts = conversations.children.map(function(child) {
    //     if (child.message) {
    //       return child.message;
    //     } else if (child.children.length > 0) {
    //       return child.children[0].message;
    //     }
    //   })
    //   util.render('messages', 'messages', {data: {messages: firsts}});
    // })
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
  conversation: function(messageId) {
    function renderConversation() {
      var conversation = app.thread.getConversation(messageId);
      conversation = conversation.map(function(message) {
        return app.messages[message.id];
      })
      _.each(conversation, function(message) {
        message.body = util.plaintextToHTML(message.body);
      })
      if (conversation) util.render('conversation', 'convDisplay', {data: {subject: conversation[0].subject, messages: conversation}});
    }
    if (app.thread) {
      renderConversation();
    } else {
      msg.latest().then(function(conversations) {
        renderConversation();
      })
    }
  },
  searchResults: function() {
    $('.menuOption').hover(
      function(e) { $(e.target).addClass('menuHover')}
     ,function(e) { $(e.target).removeClass('menuHover')}
    );
    $('.menuOption').click(function(e) {
      console.log(e);
      return false;
    })
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