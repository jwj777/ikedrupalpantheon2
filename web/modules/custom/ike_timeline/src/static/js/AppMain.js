if (typeof console === "undefined" || (window.location.hostname.lastIndexOf(".com") > -1 && window.location.hostname.lastIndexOf("dev") === -1)) {
  window.console = {
    log: function() {},
    debug: function() {},
    info: function() {},
    warn: function() {},
    error: function() {}
  };
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fn, scope) {
    var i, len, _results;
    i = 0;
    len = this.length;
    _results = [];
    while (i < len) {
      fn.call(scope, this[i], i, this);
      _results.push(++i);
    }
    return _results;
  };
}

["log", "warn"].forEach(function(method) {
  var old;
  old = console[method];
  return console[method] = function() {
    var args, e, stack;
    try {
      stack = (new Error()).stack.split(/\n/);
      if (stack[0].indexOf("Error") === 0) {
        stack = stack.slice(1);
      }
      args = [].slice.apply(arguments).concat([stack[1].trim()]);
      return old.apply(console, args);
    } catch (_error) {
      e = _error;
    }
  };
});

window.location.hash = "";

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

require.config({
  "waitSeconds": 0,
  "shim": {
    "underscore": {
      "exports": "_"
    },
    "three": {
      "exports": "THREE"
    },
    "dotdotdot": {
      "deps": ["jquery"]
    },
    "lazy": {
      "deps": ["jquery"]
    },
    "imagesloaded": {
      "deps": ["jquery"]
    },
    "detector": {
      "deps": ["three"],
      "exports": "Detector"
    },
    "projector": {
      "deps": ["three"],
      "exports": "Projector"
    },
    "canvasrender": {
      "deps": ["three"],
      "exports": "CanvasRenderer"
    },
    "backbone": {
      "deps": ["underscore"],
      "exports": "Backbone"
    },
    "soundjs": {
      "exports": "createjs"
    },
    "spectrum": {
      "deps": ["jquery"]
    }
  },
  "paths": {
    "app-view": "views/AppView",
    "abstract-view": "views/AbstractView",
    "abstract-layout": "views/AbstractLayoutView",
    "abstract-modal": "views/AbstractModalView",
    "abstract-item-view": "views/AbstractItemView",
    "abstract-nav-view": "views/AbstractNavView",
    "sprite-bitmap": "views/sprites/SpriteBitmap",
    "timeline-layout-view": "views/layouts/TimelineLayoutView",
    "mobile-timeline-layout-view": "views/layouts/MobileTimelineLayoutView",
    "lesson-plan-layout-view": "views/layouts/LessonPlanLayoutView",
    "mobile-lesson-plan-layout-view": "views/layouts/MobileLessonPlanLayoutView",
    "search-results-layout-view": "views/layouts/SearchResultsLayoutView",
    "mobile-search-results-layout-view": "views/layouts/MobileSearchResultsLayoutView",
    "mobile-milestone-layout-view": "views/layouts/MobileMilestoneLayoutView",
    "router": "router/AppRouter",
    "app-config": "config/AppConfig",
    "app-utils": "utils/AppUtils",
    "app-error": "utils/AppErrorReport",
    "pixi": "libs/pixi/pixi",
    "text": "libs/require/text",
    "videojs": "libs/video",
    "jquery": "libs-bower/jquery/dist/jquery",
    "underscore": "libs-bower/underscore/underscore",
    "backbone": "libs-bower/backbone/backbone",
    "marionette": "libs-bower/backbone.marionette/lib/backbone.marionette.min",
    "tween": "libs-bower/tweenjs/src/Tween",
    "dotdotdot": "libs-bower/jQuery.dotdotdot/src/js/jquery.dotdotdot",
    "lazy": "libs-bower/jquery.lazyload/jquery.lazyload",
    "masonry": "libs-bower/masonry/dist/masonry.pkgd",
    "imagesloaded": "libs-bower/imagesloaded/imagesloaded.pkgd.min",
    "hammer": "libs-bower/hammerjs/hammer.min",
    "spectrum": "libs-bower/spectrum/spectrum",
    "tinycolor": "libs-bower/tinycolor/tinycolor"
  }
});

require(["underscore", "backbone", "app-view", "router", "app-config", "app-utils", "app-error"], function(_, Backbone, AppView, AppRouter, AppConfig, AppUtils, AppErrorReport) {
  return $(document).ready(function() {
    var $window, base_url;
    $window = $(window);
    base_url = window.base_url;
    if (base_url.trim() !== "") {
      if (base_url.substring(0, 1) !== "/") {
        base_url = "/" + base_url;
      }
      window.base_url = base_url;
    }
    $.fn.inView = function() {
      var $el, aboveBottom, belowTop, element_height, element_position, isInViewport, scroll_position, viewport_height;
      $el = $(this);
      element_position = $el.offset().top;
      element_height = $el.height();
      scroll_position = $window.scrollTop();
      viewport_height = $window.height();
      aboveBottom = element_position < (scroll_position + viewport_height);
      belowTop = scroll_position < (element_position + element_height);
      isInViewport = aboveBottom && belowTop;
      if (isInViewport) {
        $el.addClass("in-view");
      } else {
        $el.removeClass("in-view");
      }
      $el = null;
      return isInViewport;
    };
    (function($, window, document) {
      var Plugin, defaults, pluginName;
      pluginName = "backgroundCover";
      defaults = {
        fadeIn: false
      };
      Plugin = (function() {
        function Plugin(element, options) {
          this.element = element;
          this.settings = $.extend({}, defaults, options);
          this._defaults = defaults;
          this._name = pluginName;
          this.init();
        }

        Plugin.prototype.init = function() {
          var _this = this;
          this.$element = $(this.element);
          this.$parent = this.$element.parent();
          this.window = $(window);
          this.window.resize(function() {
            return _this.onResize();
          });
          return app.utils.delay(1, function() {
            if (_this.$element.prop("complete")) {
              return _this.onResize();
            } else {
              return _this.$element.load(function() {
                return _this.onResize();
              });
            }
          });
        };

        Plugin.prototype.onResize = function() {
          var minHeight, minWidth, ratio, srcHeight, srcWidth;
          this.$element.attr("style", "");
          minWidth = this.$parent.width();
          minHeight = this.$parent.height();
          srcWidth = this.$element.width();
          srcHeight = this.$element.height();
          ratio = this.calculateAspectRatioFit(srcWidth, srcHeight, minWidth, minHeight);
          this.$element.width(Math.ceil(ratio.width + 2));
          this.$element.height(Math.ceil(ratio.height + 2));
          if (!this.$element.hasClass("is-visible")) {
            if (this.settings.fadeIn) {
              return this.$element.addClass("is-visible").hide().fadeIn();
            } else {
              return this.$element.addClass("is-visible");
            }
          }
        };

        Plugin.prototype.calculateAspectRatioFit = function(srcWidth, srcHeight, minWidth, minHeight) {
          var ratio;
          ratio = Math.max(minWidth / srcWidth, minHeight / srcHeight);
          return {
            width: srcWidth * ratio,
            height: srcHeight * ratio
          };
        };

        return Plugin;

      })();
      return $.fn[pluginName] = function(options) {
        return this.each(function() {
          if (!$.data(this, "plugin_" + pluginName)) {
            return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
          }
        });
      };
    })(jQuery, window, document);

    if (typeof Modernizr !== 'undefined') {
      Modernizr.addTest("msie", function() {
        if (/MSIE/i.test(navigator.userAgent)) {
          return true;
        }
        if (/Trident/i.test(navigator.userAgent)) {
          return true;
        }
        if (/Edge/i.test(navigator.userAgent)) {
          return true;
        }
        return false;
      });
      Modernizr.addTest("older-ie", function() {
        return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0;
      });
      Modernizr.addTest("android", function() {
        return /Android/i.test(navigator.userAgent);
      });
      Modernizr.addTest("firefox", function() {
        return /Firefox/i.test(navigator.userAgent);
      });
      Modernizr.addTest("safari", function() {
        return /Safari/i.test(navigator.userAgent);
      });
      Modernizr.addTest("iphone", function() {
        return /iPhone|iPod/i.test(navigator.userAgent);
      });
      Modernizr.addTest("ipad", function() {
        return /iPad/i.test(navigator.userAgent);
      });
      Modernizr.addTest("mobile", function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
      });
      Modernizr.addTest("chrome-ios", function() {
        return /CriOS/i.test(navigator.userAgent);
      });
      Modernizr.addTest("highresdisplay", function() {
        var mq;
        if (window.matchMedia) {
          mq = window.matchMedia('only screen and (-moz-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)');
          if (mq && mq.matches) {
            return true;
          }
        }
        return false;
      });
    }

    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      $("body").addClass("mobile-handheld");
    }
    if (/iPad/i.test(navigator.userAgent)) {
      $("body").addClass("ipad");
    }
    if (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
      $("body").addClass('ipad');
      $("body").addClass('ios');
    }
    if (/iPad/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent)) {
      $("body").addClass("ios");
    }
    $(document).unbind("keydown").bind("keydown", function(event) {
      var d, doPrevent;
      doPrevent = false;
      if (event.keyCode === 8) {
        d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === "INPUT" && (d.type.toUpperCase() === "TEXT" || d.type.toUpperCase() === "PASSWORD" || d.type.toUpperCase() === "FILE" || d.type.toUpperCase() === "EMAIL")) || d.tagName.toUpperCase() === "TEXTAREA") {
          doPrevent = d.readOnly || d.disabled;
        } else {
          doPrevent = true;
        }
      }
      if (doPrevent) {
        event.preventDefault();
      }
    });
    window.addEventListener('popstate', function(event) {
      if (event.state != null) {
        return window.location.reload();
      }
    });
    if (window.location.search.lastIndexOf("debug") > -1) {
      window.debug = true;
    }
    window.app = window.app || {};
    app.controllers = {};
    app.collections = {};
    app.models = {};
    app.views = {};
    app.appStatus = {};
    app.eventBus = _.extend({}, Backbone.Events);
    app.appConfig = AppConfig;
    app.utils = new AppUtils();
    app.views.appView = new AppView();
    if (window.colorConfig) {
      _.extend(app.appConfig.colors, window.colorConfig.colors);
      _.extend(app.appConfig.categories, window.colorConfig.categories);
    }
    return app.views.appView.on(app.views.appView.EVENT_DATA_LOADED, function() {
      var fragment, hasHistory, path, rootLength;
      base_url = window.base_url.trim();
      if (base_url.trim() !== "") {
        if (base_url.substring(0, base_url.length - 1) !== "/") {
          base_url = base_url + "/";
        }
        if (base_url.substring(0, 1) !== "/") {
          base_url = "/" + base_url;
        }
      }
      app.appRouter = new AppRouter();
      app.appRouter.on(app.appRouter.EVENT_HASH_CHANGED, app.views.appView.onPathChanged, app.views.appView);
      hasHistory = Modernizr.history;
      Backbone.history.start({
        pushState: hasHistory,
        root: base_url,
        silent: true
      });
      rootLength = Backbone.history.options.root.length;
      fragment = window.location.pathname.substr(rootLength);
      if (fragment.trim() === "") {
        return app.appRouter.defaultAction();
      } else {
        if (fragment.substring(0, 1) === "/") {
          fragment = fragment.substring(1);
        }
        path = fragment.split("/");
        console.log('path splita', path);
        return app.appRouter.pathChange(path[0], path[1], path[2]);
      }
    });
  });
});
