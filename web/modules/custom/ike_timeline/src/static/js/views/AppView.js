define(["underscore", "backbone", "marionette", "abstract-layout", "timeline-layout-view", "mobile-timeline-layout-view", "lesson-plan-layout-view", "mobile-lesson-plan-layout-view", "search-results-layout-view", "mobile-search-results-layout-view", "views/module/ShareSaveView", "views/navigation/HeaderNavView", "views/navigation/MobileHeaderNavView", "spectrum", "tinycolor"], function(_, Backbone, Marionette, AbstractLayoutView, TimelineLayoutView, MobileTimelineLayoutView, LessonPlanLayoutView, MobileLessonPlanLayoutView, SearchResultsLayoutView, MobileSearchResultsLayoutView, ShareSaveView, HeaderNavView, MobileHeaderNavView, spectrum, tinycolor) {
  var AppView;
  return AppView = Marionette.Application.extend({
    isInitLoad: true,
    isLoading: false,
    isCollapsed: false,
    isHeaderFixed: false,
    $topNavEl: null,
    EVENT_DATA_LOADED: "AppView.EVENT_DATA_LOADED",
    EVENT_TEMPLATE_LOADED: "AppView.EVENT_TEMPLATE_LOADED",
    regions: {
      mainRegion: "#content",
      container: "#container",
      mainWrapper: "#contentWrapper",
      headerRegion: "#header",
      footerRegion: "#footer",
      fullpageRegion: "main"
    },
    initialize: function(options_) {
      $.loadScript = function (url, callback) {
        $.ajax({
            url: url,
            dataType: 'script',
            success: callback,
            async: true
        });
      }
      var $colorPicker, $title, l, objURL, onColorSelect, searchStr, self, _i, _len, _ref,
        _this = this;
      app.utils.delay(100, function() {
        return _this.trigger(_this.EVENT_DATA_LOADED);
      });
      self = this;
      this.$body = $("body");
      this.$window = $(window);
      this.$document = $(document);
      this.$siteContainer = $(".site-container");
      this.$contentWrap = $(".site-content-wrapper");
      this.isDevice = this.$body.hasClass("is-device") || this.$body.hasClass("mobile-handheld");
      searchStr = window.location.search;
      objURL = {};
      searchStr.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), function($0, $1, $2, $3) {
        return objURL[$1] = $3;
      });
      if (window.debug) {
        onColorSelect = function(el, color) {
          console.log($(el).attr("id"), color);
          return app.views.currentView.updateColor($(el).attr("id"), color);
        };
        _ref = ["eisenhower-cloud", "pivotal-cloud", "history-cloud", "eisenhower-timeline", "pivotal-timeline", "history-timeline"];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          l = _ref[_i];
          $title = $("<span>&nbsp;" + l + "&nbsp;&nbsp;</span>");
          $title.insertAfter($(".top-nav"));
          $colorPicker = $("<input type='text' class='picker' id='color-picker-" + l + "'>");
          $colorPicker.insertAfter($(".top-nav")).spectrum({
            color: objURL[l] || "#f00",
            showInput: true,
            showAlpha: true,
            preferredFormat: "hex"
          }).on('change.spectrum', function(event, tinycolor) {
            var color;
            color = "0x" + tinycolor.toHexString().substr(1);
            return onColorSelect(this, color);
          });
          if (objURL[l]) {
            switch (l) {
              case "history-timeline":
                app.appConfig.colors.context_milestone_timeline = "0x" + objURL[l];
                break;
              case "pivotal-timeline":
                app.appConfig.colors.pivotal_milestone_timeline = "0x" + objURL[l];
                break;
              case "eisenhower-timeline":
                app.appConfig.colors.eisenhower_milestone_timeline = "0x" + objURL[l];
                break;
              case "history-cloud":
                app.appConfig.colors.context_milestone_tint = "0x" + objURL[l];
                break;
              case "pivotal-cloud":
                app.appConfig.colors.pivotal_moments_tint = "0x" + objURL[l];
                break;
              case "eisenhower-cloud":
                app.appConfig.colors.eisenhower_milestone_tint = "0x" + objURL[l];
            }
          }
        }
      }
      if (this.isDevice) {
        this.mobileHeaderNavView = new MobileHeaderNavView({
          el: this.headerRegion.el
        });
        this.mobileHeaderNavView.on(this.mobileHeaderNavView.FILTER_AUTOCOMPLETE, function(payload_, query_) {
          return _this.searchQueryMobile(payload_, query_, true);
        });
        this.mobileHeaderNavView.on(this.mobileHeaderNavView.RESULTS_DISPLAY, function(payload_, query_) {
          return _this.searchQueryMobile(payload_, query_, false);
        });
      } else {
        this.headerNavView = new HeaderNavView();
        this.headerNavView.on(this.headerNavView.FILTER_AUTOCOMPLETE, function(payload_, query_) {
          return _this.searchQuery(payload_, query_, true);
        });
        this.headerNavView.on(this.headerNavView.RESULTS_DISPLAY, function(payload_, query_) {
          return _this.searchQuery(payload_, query_, false);
        });
        this.shareSaveView = new ShareSaveView({
          el: $(".bottom-nav-desktop-right")
        });
      }
      this.$window.on("scroll", function() {
        return _this.onScroll();
      });
      this.onScroll();
      this.$window.on("resize", function() {
        return _this.onResize();
      });
      return this.onResize();
    },
    searchQuery: function(results_, query_, autocomplete_) {
      console.log('searchQuery:(query_, autocomplete_)', results_, query_, autocomplete_);
      if (!this.timelineLayoutView) {
        return;
      }
      if (autocomplete_) {
        if (query_ != null) {
          return this.timelineLayoutView.queryAutocomplete(results_, query_);
        }
      } else {
        return this.timelineLayoutView.displayResults(results_, query_);
      }
    },
    searchQueryMobile: function(results_, query_, autocomplete_) {
      console.log('searchQuery:(results_, query_, autocomplete_)', results_, query_, autocomplete_);
      if (!(this.mobileTimelineLayoutView || this.mobileLessonPlanLayoutView)) {
        return;
      }
      if (autocomplete_) {
        if (query_ != null) {
          return app.views.currentView.queryAutocomplete(results_, query_);
        }
      } else {
        return app.views.currentView.displayResults(results_, query_);
      }
    },
    onResize: function() {
      var h, w;
      h = this.$window.height();
      w = this.isDevice ? this.$window.width() : window.outerWidth;

      if (typeof Modernizr == 'undefined') {
        $.loadScript('https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js', function(){
          this.isMobile = Modernizr.mq("(max-width: " + app.appConfig.sizing.mobile + "px)");
        });
      }
      else {
this.isMobile = Modernizr.mq("(max-width: " + app.appConfig.sizing.mobile + "px)");
      }


      if (app.views.currentView) {
        app.views.currentView.onResize(h, w);
      }
      if (app.views.navView) {
        app.views.navView.onResize(h, w);
      }
      if (app.views.mobileNavView) {
        return app.views.mobileNavView.onResize(h, w);
      }
    },
    onScroll: function() {
      var st;
      st = this.$window.scrollTop();
      if (app.views.currentView) {
        app.views.currentView.onScroll(st);
      }
      if (app.views.navView) {
        return app.views.navView.onScroll(st);
      }
    },
    onPathChanged: function(id_, subId_, subSubId_) {
      var $children, url,
        _this = this;
      if (id_ === app.appStatus.currentPage && subId_ === app.appStatus.currentSubPage && subSubId_ === app.appStatus.currentSubSubPage) {
        return;
      }
      app.appStatus.previousPage = app.appStatus.currentPage;
      app.appStatus.previousSubPage = app.appStatus.currentSubPage;
      app.appStatus.currentPage = id_;
      app.appStatus.currentSubPage = subId_;
      app.appStatus.currentSubSubPage = subSubId_;
      url = "/" + id_;
      if (subId_) {
        url += "/" + subId_;
      }
      if (subSubId_) {
        url += "/" + subSubId_;
      }
      if (this.isInitLoad) {
        if ($(".error").length) {
          this.setCurrentView(app.appConfig.routes.ERROR);
        } else {
          this.setCurrentView(id_, subId_, subSubId_, true);
        }
        return this.isInitLoad = false;
      } else {
        app.views.navView.onCloseClick();
        $children = $("<div class='content-fadeout'/>").append(this.mainRegion.$el.children());
        $children.find("*").removeAttr("id");
        this.mainRegion.$el.append($children);
        return $children.fadeOut(function() {
          _this.mainRegion.$el.addClass("transition");
          $children.remove();
          if (_this.$get) {
            _this.$get.abort();
          }
          return _this.$get = $.ajax({
            url: url,
            dataType: "text",
            success: function(d) {
              var $loaded, matches, spUrlTitle;
              $loaded = $("<div class='content-fadein'/>");
              $loaded.append($(d).find("#content").children()).hide();
              _this.mainRegion.$el.append($loaded);
              matches = d.match(/<title>(.*?)<\/title>/);
              spUrlTitle = matches[1];
              if (spUrlTitle && spUrlTitle !== "") {
                window.document.title = spUrlTitle;
              }
              app.utils.delay(10, function() {
                return $loaded.fadeIn();
              });
              app.utils.delay(20, function() {
                if ($loaded.find(".error").length) {
                  return _this.setCurrentView(app.appConfig.routes.ERROR);
                } else {
                  return _this.setCurrentView(id_, subId_, subSubId_);
                }
              });
              return app.utils.delay(100, function() {
                return _this.mainRegion.$el.removeClass("transition");
              });
            }
          });
        });
      }
    },
    setCurrentView: function(id_, subId_, subSubId_, isInitLoad_) {
      var showMilestone,
        _this = this;
      if (id_ == null) {
        id_ = null;
      }
      if (subId_ == null) {
        subId_ = null;
      }
      if (subSubId_ == null) {
        subSubId_ = null;
      }
      if (isInitLoad_ == null) {
        isInitLoad_ = false;
      }
      console.log('setCurrentView >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', id_, subId_, subSubId_, this.fullpageRegion);
      if (this.$body.hasClass("error")) {
        app.views.currentView = new ErrorLayoutView({
          el: this.fullpageRegion.$el
        });
        this.onResize();
        return;
      }
      if (app.views.currentView) {
        app.views.currentView.destroy();
      }
      if (id_ !== app.appConfig.routes.MOBILE && this.isDevice) {
        switch (id_) {
          case app.appConfig.routes.SEARCH:
            app.views.currentView = new MobileSearchResultsLayoutView();
            break;
          case app.appConfig.routes.LESSON_PLANS:
            this.mobileLessonPlanLayoutView = new MobileLessonPlanLayoutView({
              el: this.container.el
            });
            app.views.currentView = this.mobileLessonPlanLayoutView;
            break;
          case app.appConfig.routes.DEFAULT:
          case app.appConfig.routes.MILE_STONE:
            showMilestone = id_ === app.appConfig.routes.MILE_STONE;
            this.mobileTimelineLayoutView = new MobileTimelineLayoutView({
              el: this.container.el,
              showMilestone: showMilestone
            });
            app.views.currentView = this.mobileTimelineLayoutView;
        }
      } else {
        switch (id_) {
          case app.appConfig.routes.SEARCH:
            this.searchResultsLayout = new SearchResultsLayout();
            break;
          case app.appConfig.routes.LESSON_PLANS:
            app.views.currentView = new LessonPlanLayoutView({
              el: this.container.$el
            });
            break;
          case app.appConfig.routes.DEFAULT:
          case app.appConfig.routes.MILE_STONE:
            showMilestone = id_ === app.appConfig.routes.MILE_STONE;
            this.timelineLayoutView = new TimelineLayoutView({
              showMilestone: showMilestone
            });
            app.views.currentView = this.timelineLayoutView;
            this.timelineLayoutView.on(this.timelineLayoutView.CLEAR, function() {
              return _this.headerNavView.clear();
            });
        }
      }
      return this.onResize();
    }
  });
});
