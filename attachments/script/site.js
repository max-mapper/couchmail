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
  searchResults: function() {
    $( '.timeago' ).timeago();
    $('.menuOption').hover(
      function(e) { $(this).addClass('menuHover')}
     ,function(e) { $(this).removeClass('menuHover')}
    );
    $('.menuOption').click(function(e) {
      var docid = $(this).attr('data-id'),
        type = $(this).attr('data-type')
      couch.get(app.config.baseURL + "api/" + type + "/" + docid).then(function(message) {
        $('.splash').hide()
        $('#' + type + '_search_container').html("loading...")
        $('.optionsMenu').html("")
        util.siblings[type](message).then(function(messages) {
          util.render(type, type + '_search_container', {date: messages[0].date, messages: messages})
        })
      })
      return false;
    })
  },
  mail: function() { $( '.timeago' ).timeago() },
  irc: function() { $( '.timeago' ).timeago() }
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