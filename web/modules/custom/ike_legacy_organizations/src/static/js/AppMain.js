if (typeof console === "undefined" || (window.location.hostname.lastIndexOf("eisenhowermemorial.gov") > -1 && window.location.hostname.lastIndexOf("dev") === -1)) {
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

window.storedHash = window.location.hash;

window.location.hash = "";

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

require.config({
  paths: {
    "app-view": "views/AppView",
    "router": "router/AppRouter",
    "app-config": "config/AppConfig",
    "app-utils": "utils/AppUtils",
    "app-error": "utils/AppErrorReport",
    "lp-timeline-app-view": "lp_timeline/views/LPTimelineAppView",
    "lp-timeline-abstract-view": "lp_timeline/views/LPTimelineAbstractView",
    "lp-timeline-abstract-layout": "lp_timeline/views/LPTimelineAbstractLayoutView",
    "lp-timeline-abstract-modal": "lp_timeline/views/LPTimelineAbstractModalView",
    "lp-timeline-abstract-item-view": "lp_timeline/views/LPTimelineAbstractItemView",
    "lp-timeline-share-save": "lp_timeline/views/modules/LPTimelineShareSaveView",
    "lp-timeline-router": "lp_timeline/router/LPTimelineAppRouter",
    "lp-timeline-app-utils": "lp_timeline/utils/LPTimelineUtils",
    "lp-timeline-app-config": "lp_timeline/config/LPTimelineAppConfig",
    "unslider": "libs/unslider/unslider.min",
    "jqueryUI": "libs/jquery/jquery-ui.min",
    "accordion": "libs/jquery/jquery.accordion",
    "fullpage": "libs/fullpage/jquery.fullPage",
    "wavesurfer": "libs/wavesurfer/wavesurfer.min",
    "grid-gallery": "libs/cbpGridGallery",
    "slick": "libs/slick/slick.min",
    "videojs": "libs/video",
    "migrate": "https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/1.2.1/jquery-migrate.min",
    "slimscroll": "https://cdnjs.cloudflare.com/ajax/libs/jQuery-slimScroll/1.3.6/jquery.slimscroll.min",
    "text": "libs/require/text",
    "jquery": "libs-bower/jquery/dist/jquery.min",
    "underscore": "libs-bower/underscore/underscore",
    "backbone": "libs-bower/backbone/backbone",
    "marionette": "libs-bower/backbone.marionette/lib/backbone.marionette",
    "hammer": "libs-bower/hammerjs/hammer",
    "imagesloaded": "libs-bower/imagesloaded/imagesloaded.pkgd",
    "dotdotdot": "libs-bower/jQuery.dotdotdot/src/js/jquery.dotdotdot",
    "lazy": "libs-bower/lazysizes/lazysizes",
    "masonry": "libs-bower/masonry/dist/masonry.pkgd",
    "transit": "libs-bower/jquery.transit/jquery.transit",
    "objectfit": "libs-bower/objectFitPolyfill/dist/objectFitPolyfill.min",
    "fastdom": "libs-bower/fastdom/fastdom"
  },
  shim: {
    "underscore": {
      exports: "_"
    },
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    "accordion": {
      deps: ["jquery"]
    },
    "dotdotdot": {
      deps: ["jquery"]
    },
    "hammer": {
      deps: ["jquery"]
    },
    "transit": {
      deps: ["jquery"]
    },
    "masonry": {
      deps: ["jquery"]
    },
    "migrate": {
      deps: ["jquery"]
    },
    "slimscroll": {
      deps: ["jquery"]
    },
    "unslider": {
      deps: ["jquery", "hammer", "imagesloaded"]
    }
  }
});

require(["jquery", "underscore", "backbone", "lp-timeline-app-view", "router", "app-config", "app-utils", "migrate", "lazy", "slimscroll", "objectfit", "fastdom", "app-error"], function($, _, Backbone, AppView, AppRouter, AppConfig, AppUtils, migrate, lazy, slimscroll, objectfit, fastdom, AppErrorReport) {
  return $(document).ready(function() {
    window.app = window.app || {};
    app.controllers = {};
    app.collections = {};
    app.models = {};
    app.views = {};
    app.appStatus = {};
    app.eventBus = _.extend({}, Backbone.Events);
    app.appConfig = AppConfig;
    app.utils = new AppUtils();
    app.views.AppView = new AppView();
    app.views.AppView.on(app.views.AppView.EVENT_DATA_LOADED, function() {
      var fragment, hasHistory, path, rootLength;
      app.appRouter = new AppRouter();
      app.appRouter.on(app.appRouter.EVENT_HASH_CHANGED, app.views.AppView.onPathChanged, app.views.AppView);
      hasHistory = Modernizr.history;
      Backbone.history.start({
        pushState: hasHistory,
        root: '/',
        silent: true
      });
      if (!hasHistory) {
        rootLength = Backbone.history.options.root.length;
        fragment = window.location.pathname.substr(rootLength);
        if (fragment.trim() === "") {
          app.appRouter["default"]();
        } else {
          path = fragment.split("/");
          app.appRouter.pathChange(path[0], path[1], path[2]);
        }
      } else {
        Backbone.history.loadUrl(Backbone.history.getFragment());
      }
      return window.location.hash = window.storedHash;
    });
    if (navigator.userAgent.toLowerCase().lastIndexOf("msie") > -1) {
      $("html").addClass("ie");
    }
    if (window.location.toString().lastIndexOf("debug") > -1) {
      $("body").addClass("debug").append($("<div id='debug-grid'></div>"));
    }
    return (function($, window, document) {
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
          this.onResize();
          return app.utils.delay(50, function() {
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
          var _this = this;
          this.$element.attr("style", "");
          return fastdom.measure(function() {
            debugger;
            var minHeight, minWidth, ratio, srcHeight, srcWidth;
            minWidth = _this.$parent.width();
            minHeight = _this.$parent.height();
            srcWidth = _this.$element.width();
            srcHeight = _this.$element.height();
            ratio = _this.calculateAspectRatioFit(srcWidth, srcHeight, minWidth, minHeight);
            return fastdom.mutate(function() {
              debugger;
              _this.$element.width(Math.ceil(ratio.width + 2));
              _this.$element.height(Math.ceil(ratio.height + 2));
              if (!_this.$element.hasClass("is-visible")) {
                return _this.$element.addClass("is-visible");
              }
            });
          });
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
  });
});
