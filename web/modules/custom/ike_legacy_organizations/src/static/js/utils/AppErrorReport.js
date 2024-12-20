(function() {
  return window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {
    var data;
    data = {
      errorMsg: errorMsg,
      file: url,
      lineNumber: lineNumber,
      agent: navigator.userAgent,
      webpage: window.location.href,
      screensize: window.innerWidth + " x " + window.innerHeight
    };
    data.column = column || "no column";
    data.stack = errorObj.stack || "no stack";
    data.raw = JSON.stringify(data);
    return $.ajax({
      url: '/api/logs',
      method: 'POST',
      data: data,
      beforeSend: function(request) {
        return request.setRequestHeader('X-CSRF-Token', csrf_token);
      }
    });
  };
})();
