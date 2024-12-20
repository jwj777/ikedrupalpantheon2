define(["underscore", "backbone", "jquery"], function(_, Backbone, $) {
  var LPTimelineUtils;
  return LPTimelineUtils = Backbone.Model.extend({
    tmplCache: [],
    renderTemplate: function(tmplName, tmplData, deepLink) {
      var tmplString, tmplURL;
      if (deepLink == null) {
        deepLink = false;
      }
      if (!this.tmplCache[tmplName]) {
        tmplURL = deepLink ? tmplName : "static/templates/" + tmplName + ".html";
        tmplString = void 0;
        $.ajax({
          url: tmplURL,
          method: "GET",
          async: false,
          success: function(data) {
            return tmplString = data;
          },
          error: function(jqXHR, exception) {
            return console.warn(jqXHR, exception);
          }
        });
        if (typeof tmplString !== 'string') {
          tmplString = "<span class='center'><h1>MISSING HTML</h1></span>";
        }
        this.tmplCache[tmplName] = tmplString;
      }
      return _.template(this.tmplCache[tmplName], tmplData);
    },
    delay: function(delay, func) {
      return setTimeout(func, delay);
    },
    randomID: function() {
      return Math.random().toString(36).substring(7);
    },
    getVideoPlayer: function(video, w, h) {
      var id, iframe, match, regExp, split;
      if (!video) {
        return "";
      }
      if (!w > 0 || !h > 0) {
        w = 840;
        h = 420;
      }
      iframe = "";
      if (video.indexOf("vimeo") !== -1) {
        split = video.split("/");
        id = split[split.length - 1];
        iframe += "<iframe src=\"//player.vimeo.com/video/" + id.trim() + "\" width=\"" + w + "px\" height=\"" + h + "px\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
      } else if (video.indexOf("youtube") !== -1) {
        id = "";
        regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        match = video.match(regExp);
        if (match && match[2].length === 11) {
          id = match[2];
        } else {
          console.log("Youtube link incorrect: " + video);
        }
        iframe += "<iframe src=\"//www.youtube.com/embed/" + id.trim() + "\" width=\"" + w + "\" height=\"" + h + "\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
      }
      return iframe;
    },
    objIsEmpty: function(obj) {
      return Object.keys(obj).length === 0;
    },
    slugify: function(text, nospace) {
      var e;
      if (nospace == null) {
        nospace = false;
      }
      try {
        if (nospace) {
          return text.toLowerCase().replace(RegExp(" ", "g"), "").replace(/[^\w-]+/g, "");
        } else {
          return text.toLowerCase().replace(RegExp(" ", "g"), "-").replace(/[^\w-]+/g, "");
        }
      } catch (_error) {
        e = _error;
        return console.log('slugify', text, e);
      }
    },
    unslugify: function(text) {
      var e, newWords, word, words, _i, _len;
      try {
        words = text.split("-");
        newWords = [];
        for (_i = 0, _len = words.length; _i < _len; _i++) {
          word = words[_i];
          newWords.push(word.charAt(0).toUpperCase() + word.slice(1));
        }
        return newWords.join(" ");
      } catch (_error) {
        e = _error;
        return console.log('slugify', text, e);
      }
    },
    validateEmail: function(v) {
      var emailPattern;
      emailPattern = /^([\w.-]+)@([\w.-]+)\.([a-zA-Z.]{2,6})$/i;
      return v.match(emailPattern);
    },
    valueInObject: function(val, obj) {
      var k;
      for (k in obj) {
        if (!obj.hasOwnProperty(k)) {
          continue;
        }
        if (obj[k] === val) {
          return true;
        }
      }
      return false;
    },
    printUrl: function(url) {
      var $body, $iframe;
      $iframe = $("<iframe width='1' height='1'/>");
      $body = $("body");
      $body.append($iframe);
      $iframe.attr("src", "/");
      return $iframe.load(function() {
        $iframe.get(0).contentWindow.location = url;
        if (!$iframe) {
          alert("Error: Can't find");
          return;
        }
        return $body.on("PAGE_RENDERED", function() {
          var frame;
          $body.off("PAGE_RENDERED");
          frame = $iframe.get(0).contentWindow;
          frame.focus();
          return frame.print();
        });
      });
    },
    millisecondsToTime: function(milli) {
      var format, milliseconds, minutes, seconds;
      milliseconds = milli % 1000;
      seconds = Math.floor((milli / 1000) % 60);
      minutes = Math.floor((milli / (60 * 1000)) % 60);
      seconds = seconds < 10 ? "0" + seconds : seconds;
      format = minutes + ":" + seconds;
      return format;
    },
    getRandomInRange: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getParameterByName: function(name) {
      var regex, results;
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      results = regex.exec(location.search);
      if (results === null) {
        return '';
      } else {
        return decodeURIComponent(results[1].replace(/\+/g, ' '));
      }
    },
    arrayMatches: function(a, b) {
      var e, i, matches;
      matches = [];
      i = 0;
      while (i < a.length) {
        e = 0;
        while (e < b.length) {
          if (a[i] === b[e]) {
            matches.push(a[i]);
          }
          e++;
        }
        i++;
      }
      return matches;
    },
    clone: function(obj) {
      var flags, key, newInstance;
      if ((obj == null) || typeof obj !== 'object') {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof RegExp) {
        flags = '';
        if (obj.global != null) {
          flags += 'g';
        }
        if (obj.ignoreCase != null) {
          flags += 'i';
        }
        if (obj.multiline != null) {
          flags += 'm';
        }
        if (obj.sticky != null) {
          flags += 'y';
        }
        return new RegExp(obj.source, flags);
      }
      newInstance = new obj.constructor();
      for (key in obj) {
        newInstance[key] = this.clone(obj[key]);
      }
      return newInstance;
    }
  });
});
