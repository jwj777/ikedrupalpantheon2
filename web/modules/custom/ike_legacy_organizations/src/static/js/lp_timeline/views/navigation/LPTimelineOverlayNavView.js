define(["underscore", "backbone", "jquery", "accordion", "fastdom", "lp_timeline/views/modules/LPTimelineSocialIconView", "lp_timeline/views/LPTimelineAbstractItemView"], function(_, Backbone, $, accordion, fastdom, LPTimelineSocialIconView, LPTimelineAbstractItemView) {
  var LPTimelineOverlayNavView;
  return LPTimelineOverlayNavView = LPTimelineAbstractItemView.extend({
    events: {
      "click .bookend-dot": "navigateTo",
      "click .lorg-title": "navigateTo",
      "click .chapter-title": "navigateTo",
      "click .subchapter-title": "navigateTo",
      "click .close-icon": "onCloseClick"
    },
    initialize: function(args_) {
      var _this = this;
      LPTimelineAbstractItemView.prototype.initialize.call(this);
      this.$body = $("body");
      this.$verticalBreadcrumb = this.$el.find(".vertical-breadcrumb");
      this.$overlayBkg = this.$el.find(".overlay-bkg");
      this.$lorgChapters = this.$el.find(".lorg-chapters");
      this.$subchapters = this.$el.find(".subchapters");
      this.$lorgItems = this.$el.find(".bookend-dot, .lorg, .chapter");
      this.$menuItems = this.$el.find(".bookend-dot, .lorg-title, .chapter-title, .subchapter-title");
      this.$chaptersCell = $(".lorgs.display-cell");
      this.$el.mouseover(function() {
        if (!_this.isMobile) {
          return _this.$el.width(_this.$el.data("width"));
        }
      });
      this.$el.mouseout(function() {
        if (!_this.isMobile) {
          return _this.$el.attr("style", "");
        }
      });
      app.eventBus.on("CHAPTER_NEXT", function(index_) {
        return _this.updateMenu(index_);
      });
      return fastdom.measure(function() {
        var bW, textWidth, w;
        textWidth = _this.$chaptersCell.width() + 80;
        bW = _this.$body.width() * 0.1816578;
        w = Math.max(bW, textWidth);
        $('[data-accordion]').accordion({
          "transitionSpeed": 400,
          "singleOpen": true
        });
        return fastdom.mutate(function() {
          _this.$el.data("width", w).removeClass("is-invisible");
          return _this.$overlayBkg.width(w);
        });
      });
    },
    navigateTo: function(e) {
      var $target, id;
      $target = $(e.currentTarget);
      id = $target.data().id;
      return app.eventBus.trigger("CHAPTER_CLICK", id);
    },
    toggleActive: function() {
      var overflow, w,
        _this = this;
      this.$el.toggleClass("active");
      if (this.isPhone) {
        overflow = this.$el.hasClass("active") ? "hidden" : "auto";
        return this.$body.css("overflow-y", overflow);
      } else {
        w = this.$el.data("width");
        return fastdom.mutate(function() {
          _this.$el.width(w);
          return _this.$overlayBkg.width(w);
        });
      }
    },
    updateMenu: function(index_) {
      var prevWasTitle,
        _this = this;
      prevWasTitle = false;
      return fastdom.mutate(function() {
        var $dataAccordion, i, item, _results, _results1;
        if (_this.isPhone) {
          return _this.$el.removeClass("active");
        } else {
          _this.$lorgItems.removeClass("active");
          _this.$menuItems.removeClass("active");
          if (_this.$current) {
            if (_this.$current.hasClass("lorg-title")) {
              prevWasTitle = true;
            }
          }
          _this.$current = $(_this.$menuItems[index_]);
          _this.$current.addClass("active");
          _this.$current.trigger("accordian.forceOpen");
          $dataAccordion = _this.$current.parents('[data-accordion]');
          if (prevWasTitle) {
            i = $dataAccordion.length;
            _results = [];
            while (i) {
              item = $dataAccordion[i - 1];
              $(item).children().first().trigger("accordian.forceOpen");
              _results.push(i--);
            }
            return _results;
          } else {
            i = 0;
            _results1 = [];
            while (i < $dataAccordion.length) {
              item = $dataAccordion[i];
              $(item).children().first().trigger("accordian.forceOpen");
              _results1.push(i++);
            }
            return _results1;
          }
        }
      });
    },
    onResize: function(h_, w_) {
      var _this = this;
      LPTimelineAbstractItemView.prototype.onResize(h_, w_);
      return fastdom.mutate(function() {
        if (_this.isPhone) {
          _this.$el.attr("style", "");
          _this.$lorgChapters.hide();
          _this.$verticalBreadcrumb.height("");
        } else {
          _this.$verticalBreadcrumb.height(h_);
        }
        if (_this.isMobile) {
          return _this.$el.removeClass("active");
        }
      });
    },
    onCloseClick: function() {
      return this.toggleActive();
    }
  });
});
