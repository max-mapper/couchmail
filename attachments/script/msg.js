var msg = function() {

  function latest() {
    return couch.get(app.config.baseURL + "_view/by_date?descending=true");
  }

  return {
    latest:latest
  };
}();