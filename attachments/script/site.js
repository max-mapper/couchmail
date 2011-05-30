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
    
    couch.get(app.config.baseURL + "_view/by_date?descending=true").then(function(messages) {
      
      messages = messages.rows.map(function(message) {
        return message.value;
      })
      
      util.render('messages', 'messages', {data: {messages: messages}});
      
    })
  })
  
})

app.after = {
  messages: function() {

  }
}

$(function() {
  
  app.sammy.run();
  
})