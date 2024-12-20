define(["jquery", "underscore", "backbone", "marionette", 'fastdom', "lp_timeline/views/LPTimelineAbstractLayoutView", "lp_timeline/views/navigation/LPTimelineOverlayNavView", "lp_timeline/views/navigation/LPTimelineMobileNavView", "lp_timeline/views/navigation/LPTimelineFooterView", "lp_timeline/views/layouts/LPTimelineHomepageLayoutView", "lp_timeline/views/modules/LPTimelineShareSaveView"], function($, _, Backbone, Marionette, fastdom, AbstractLayoutView, LPTimelineOverlayNavView, LPTimelineMobileNavView, LPTimelineFooterView, LPTimelineHomepageLayoutView, LPTimelineShareSaveView) {
  var LPTimelineAppView;
  return LPTimelineAppView = Marionette.Application.extend({
    isInitLoad: true,
    isLoading: false,
    isCollapsed: false,
    isHeaderFixed: false,
    $topNavEl: null,
    EVENT_DATA_LOADED: "LPTimelineAppView.EVENT_DATA_LOADED",
    EVENT_TEMPLATE_LOADED: "LPTimelineAppView.EVENT_TEMPLATE_LOADED",
    regions: {
      navigationRegion: "#header",
      mainRegion: "#content",
      footerRegion: "#footer",
      fullpageRegion: "#fullpage"
    },
    initialize: function(options_) {
      var $overlay, $share, $topNavMobile,
        _this = this;
      this.$window = $(window);
      this.$body = $("body");
      this.$contentWrap = $(".site-content-wrap");
      $overlay = $(".overlay");
      $topNavMobile = $(".top-nav-mobile");
      $share = $(".top-nav-desktop-right");
      this.shareView = new LPTimelineShareSaveView({
        el: $share
      });
      this.shareMobileView = new LPTimelineShareSaveView({
        el: $overlay
      });
      this.overlayNavView = new LPTimelineOverlayNavView({
        el: $overlay
      });
      this.mobileNavView = new LPTimelineMobileNavView({
        el: $topNavMobile
      });
      this.mobileNavView.on(this.mobileNavView.HAMBURGER_CLICK, function() {
        return _this.overlayNavView.toggleActive();
      });
      this.$contentWrap.on("scroll", function() {
        return _this.onScroll();
      });
      this.onScroll();
      this.$window.on("resize", function() {
        return _this.onResize();
      });
      this.onResize();
      if ($(".error").length) {
        this.setErrorPage();
      }
      return app.utils.delay(100, function() {
        return _this.trigger(_this.EVENT_DATA_LOADED);
      });
    },
    onResize: function() {
      var _this = this;
      if (this.resizeDebounce) {
        clearTimeout(this.resizeDebounce);
      }
      return this.resizeDebounce = app.utils.delay(100, function() {
        return fastdom.measure(function() {
          var h, w;
          h = _this.$window.height();
          w = _this.$window.width();
          _this.overlayNavView.onResize(h, w);
          _this.shareView.onResize(h, w);
          _this.shareMobileView.onResize(h, w);
          if (app.views.currentView) {
            return app.views.currentView.onResize(h, w);
          }
        });
      });
    },
    onScroll: function() {
      var _this = this;
      if (this.scrollDebounce) {
        clearTimeout(this.scrollDebounce);
      }
      return this.scrollDebounce = app.utils.delay(100, function() {
        if ((_this.$topNavEl != null) && _this.isHeaderFixed === false) {
          if (_this.$contentWrap.scrollTop() > 100) {
            if (_this.isCollapsed === false) {
              fastdom.mutate(function() {
                return _this.$topNavEl.addClass("collapsed");
              });
              return _this.isCollapsed = true;
            }
          } else {
            if (_this.isCollapsed) {
              fastdom.mutate(function() {
                return _this.$topNavEl.removeClass("collapsed");
              });
              return _this.isCollapsed = false;
            }
          }
        }
      });
    },
    onPathChanged: function(id_, subId_, subSubId_) {
      var $children, url,
        _this = this;
      console.log('onPathChanged > ', id_, subId_, subSubId_);
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
      var headerFixed, navActive;
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
      console.log('setCurrentView >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', id_, subId_, subSubId_);
      if (app.views.currentView) {
        app.views.currentView.destroy();
      }
      navActive = "all";
      switch (id_) {
        case app.appConfig.routes.DEFAULT:
          app.views.currentView = new LPTimelineHomepageLayoutView({
            el: this.fullpageRegion.$el
          });
          headerFixed = false;
          break;
        default:
          app.views.currentView = new AbstractLayoutView();
      }
      this.setNavigationActive(navActive);
      return this.onResize();
    },
    setNavigationActive: function(id_) {},
    setErrorPage: function() {
      var search;
      $(".search-icon-wrapper").click(function() {
        return search();
      });
      $(".results-search input").keyup(function(e) {
        if (e.keyCode === 13 || e.which === 13) {
          return search();
        }
      });
      return search = function() {
        var val;
        val = $(".results-search input").val().trim();
        if (val !== "" && val.length >= 3) {
          return window.location.href = "/search/results?term=" + escape(val);
        }
      };
    }
  });
});
