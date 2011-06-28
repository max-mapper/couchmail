var msg = function() {

  function latest() {
    var dfd = $.Deferred();
    couch.get(app.config.baseURL + "_view/by_date?descending=true").then(function(messages) {
      util.threadMessages(messages);
      dfd.resolve(messages);
    })
    return dfd.promise();
  }

  return {
    latest:latest
  };
}();