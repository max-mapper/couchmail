var app = {
  container: '#wrapper',
  site: {config:{}}, 
  emitter: new util.Emitter(),
  config: {
  	baseURL: util.getBaseURL(document.location.pathname)
  }
};

app.sammy = $.sammy(app.container, function() {
  
  this.bind('run', function(e) {    
    
    msg.latest().then(function(messages) {
      
      messages = messages.rows.map(function(message) {
        return message.value;
      })
      
      util.render('messages', 'messages', {data: {messages: messages}});
      util.render('conversation', 'convDisplay', {data: {subject: "woo", messages: messages}});
      
    })
  })
  
})

app.after = {
  messages: function() {
    $( '.timeago' ).timeago();
    $('.convSummary').click(function(e) {
      $(this).addClass('highlight');
      e.preventDefault();
    })
  }
}

$(function() {
  
  app.sammy.run();
  
})