define(["underscore", "backbone", "jquery", "fullpage", "fastdom", "lazy", "lp_timeline/views/LPTimelineAbstractLayoutView", "lp_timeline/views/modules/LPTimelineSlideView", "lp_timeline/views/modules/LPTimelineCoverFlowView"], function(_, Backbone, $, fullpage, fastdom, lazy, AbstractLayoutView, LPTimelineSlideView, LPTimelineCoverFlowView) {
  var LPTimelineHomepageLayoutView;
  return LPTimelineHomepageLayoutView = AbstractLayoutView.extend({
    currentIndex: 0,
    slideIndex: 0,
    slides: [],
    events: {
      "click .chapter-dot": function() {
        return $.fn.fullpage.moveTo('goToPage');
      }
    },
    initialize: function() {
      var $desktopThumbs, $window, img, self, _i, _len, _ref,
        _this = this;
      AbstractLayoutView.prototype.initialize.call(this);
      /* image and resize
      				#-----------------------------------------------
      */

      self = this;
      $window = $(window);
      this.$vertical = this.$el.find('.vertical-breadcrumb');
      this.$imgFull = this.$el.find('.img-full');
      this.$thumbsWrapper = this.$el.find(".chapter-thumbs-wrapper");
      this.$scrollToBegin = this.$el.find(".scroll-to-begin");
      this.$el.find(".section").each(function(i_, el_) {
        var slideView;
        slideView = new LPTimelineSlideView({
          el: el_
        });
        return self.slides.push(slideView);
      });
      lazySizes.init();
      this.insertEndScroll();
      this.resetPlugin();
      this.onResize($window.height(), $window.width());
      _ref = this.$imgFull;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        img = _ref[_i];
        $(img).one('load', function() {
          $(this).addClass('onload');
          return self.onResize($window.height(), $window.width());
        });
      }
      $desktopThumbs = $("div[data-anchor='timeline-intro'], div.lorg-landing").find(".chapter-thumb");
      $desktopThumbs.click(function() {
        var id;
        id = $(this).data().anchorid;
        return self.moveToSlide(id);
      });
      $window.resize(function() {
        return _this.onResize($window.height(), $window.width());
      });
      $("body").addClass("onload");
      return app.eventBus.on("CHAPTER_CLICK", function(id_) {
        return _this.moveToSlide(id_);
      });
    },
    insertEndScroll: function() {
      var $arrow, template;
      template = " \n<div class='scroll-to-begin'>\n	<div class='up-arrow-icon'></div>\n	<span class='scroll-cta-txt'>Scroll to Top</span> \n</div>";
      $arrow = $(template);
      this.$el.find(".section").last().append($arrow);
      return $arrow.click(function() {
        return window.location.hash = "timeline-intro";
      });
    },
    resetPlugin: function(destroy_) {
      var $full, isChrome, isSafari, self;
      isSafari = /constructor/i.test(window.HTMLElement) || (function(p) {
        return p.toString() === '[object SafariRemoteNotification]';
      })(!window['safari'] || safari.pushNotification);
      isChrome = !!window.chrome && !!window.chrome.webstore;
      self = this;
      if (destroy_) {
        $.fn.fullpage.destroy('all');
      }
      return $full = $('#fullpage').fullpage({
        scrollBar: false,
        css3: isSafari,
        verticalCentered: false,
        resize: false,
        autoScrolling: true,
        responsiveWidth: app.appConfig.sizing.mobile + 1,
        onLeave: function(index, nextIndex, direction) {
          var newCurrent;
          app.eventBus.trigger("CHAPTER_NEXT", nextIndex - 1);
          $(".sliding").removeClass("sliding");
          $(".previous").removeClass("previous");
          $(".next").removeClass("next");
          newCurrent = self.slides[nextIndex - 1];
          newCurrent.loadAudio();
          newCurrent.$el.prev().addClass("previous");
          newCurrent.$el.next().addClass("next");
          return self.destroyModalsAndAudio();
        },
        afterLoad: function(anchorLink, index) {
          var load, url;
          this.currentIndex = index;
          load = $(this);
          if (load.data("src")) {
            url = load.data("src");
            load.attr("style", "background-image:url(" + url + ");");
            return load.removeAttr("data-src");
          }
        },
        afterRender: function() {
          return $('#fullpage').addClass('onload');
        },
        afterResize: function() {
          return console.log('afterResize');
        },
        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex) {
          return console.log('afterSlideLoad', anchorLink, index, slideAnchor, slideIndex);
        },
        onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex) {
          return console.log('onSlideLeave', anchorLink, index, slideIndex, direction, nextSlideIndex);
        }
      });
    },
    moveToSlide: function(slideTo_) {
      return $.fn.fullpage.moveTo(slideTo_);
    },
    onResize: function(height_, width_) {
      var $thumbsWrapper, slide, thumbsWrapper, _fn, _i, _j, _len, _len1, _ref, _ref1, _results,
        _this = this;
      this.isPhone = Modernizr.mq("(max-width: " + app.appConfig.sizing.phone + "px)");
      this.isMobile = Modernizr.mq("(max-width: " + app.appConfig.sizing.mobile + "px)");
      _ref = this.$thumbsWrapper;
      _fn = function($thumbsWrapper) {
        return fastdom.measure(function() {
          var ihw, ip, newH, offset, stb;
          offset = _this.isMobile ? 230 : 125;
          ihw = $thumbsWrapper.parent().find(".intro-header-wrapper").outerHeight();
          ip = $thumbsWrapper.parent().find(".intro-paragraph").outerHeight();
          stb = $thumbsWrapper.parent().find(".scroll-to-begin").height();
          newH = height_ - (ihw + ip + stb + offset);
          return fastdom.mutate(function() {
            return $thumbsWrapper.height(newH);
          });
        });
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thumbsWrapper = _ref[_i];
        $thumbsWrapper = $(thumbsWrapper);
        _fn($thumbsWrapper);
      }
      _ref1 = this.slides;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        slide = _ref1[_j];
        _results.push(slide.onResize(height_, width_));
      }
      return _results;
    },
    destroyModalsAndAudio: function() {
      var slide, _i, _len, _ref, _results;
      _ref = this.slides;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slide = _ref[_i];
        slide.destroyModal();
        _results.push(slide.turnOffAudio());
      }
      return _results;
    },
    destroy: function() {
      return AbstractLayoutView.prototype.destroy.call(this);
    }
  });
});
