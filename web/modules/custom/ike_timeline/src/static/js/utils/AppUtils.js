define(["underscore", "backbone"], function(_, Backbone) {
  var Utils;
  return Utils = Backbone.Model.extend({
    delay: function(delay, func) {
      return setTimeout(func, delay);
    },
    randomID: function() {
      return Math.random().toString(36).substring(7);
    },
    objIsEmpty: function(obj) {
      return Object.keys(obj).length === 0;
    },
    slugify: function(text, nospace) {
      var e;
      if (text == null) {
        text = "";
      }
      if (nospace == null) {
        nospace = false;
      }
      try {
        if (nospace) {
          return text.trim().toLowerCase().replace(RegExp(" ", "g"), "").replace(/[^\w-]+/g, "");
        } else {
          return text.trim().toLowerCase().replace(RegExp(" ", "g"), "-").replace(/[^\w-]+/g, "");
        }
      } catch (_error) {
        e = _error;
        console.log('slugify', text, e);
        return console.trace();
      }
    },
    unslugify: function(text) {
      var e, newWords, word, words, _i, _len;
      if (text == null) {
        text = "";
      }
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
    },
    smarten: function(text) {
      var str;
      str = text.replace(/(^|[-\u2014\s(\["])'/g, '$1‘').replace(/'/g, '’').replace(/(^|[-\u2014/\[(\u2018\s])"/g, '$1“').replace(/"/g, '”').replace(/--/g, '—');
      return str;
    },
    htmlDecode: function(value) {
      return $('<div/>').html(value).text();
    },
    noOrphan: function(txtObj) {
      var wordArray;
      wordArray = txtObj.text().split(' ');
      if (wordArray.length > 1) {
        wordArray[wordArray.length - 2] += '&nbsp;' + wordArray[wordArray.length - 1];
        wordArray.pop();
        return txtObj.html(wordArray.join(' '));
      }
    }
  });
});
