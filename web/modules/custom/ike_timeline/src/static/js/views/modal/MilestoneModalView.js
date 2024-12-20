define(["jquery", "underscore", "backbone", "marionette", "abstract-item-view", "dotdotdot", "views/module/ModuleAudioView", "views/module/ModuleVideoPlayerView"], function($, _, Backbone, Marionette, AbstractItemView, dot, ModuleAudioView, ModuleVideoPlayerView) {
  var MilestoneModalView;
  return MilestoneModalView = AbstractItemView.extend({
    CLICK: "MilestoneModalView.CLICK",
    ACTIVE: "MilestoneModalView.ACTIVE",
    INACTIVE: "MilestoneModalView.INACTIVE",
    PREV: "MilestoneModalView.PREV",
    NEXT: "MilestoneModalView.NEXT",
    DESTROY: "MilestoneModalView.DESTROY",
    TITLE_HEIGHT: 65,
    MIN_IMAGE_HEIGHT: 200,
    MIN_IMAGE_WIDTH: 200,
    MAX_IMAGE_WIDTH: 500,
    MIN_VIDEO_WIDTH: 200,
    MAX_VIDEO_WIDTH: 800,
    UI_AREA_WIDTH: 400,
    UI_AREA_WIDTH_SMALL: 160,
    isDestroyed: false,
    isFullscreen: false,
    events: {
      "click .milestone-close": "onCloseClick",
      "click .milestone-prev": "onPrevClick",
      "click .milestone-next": "onNextClick",
      "click .milestone-image-wrapper img, .module-audio-and-image img": "onFullScreenClick"
    },
    initialize: function(data) {
      var $video, cat, url,
        _this = this;
      this.data = data;
      AbstractItemView.prototype.initialize.call(this, this.data);
      this.$body.scrollTop(0).css({
        "overflow-y": "hidden"
      });
      this.$container = $("#container");
      if (this.data.el) {
        this.$el = this.data.el;
      }
      this.$milestoneImg = this.$el.find(".milestone-image-wrapper img, .module-audio-and-image img");
      this.$milestoneVid = this.$el.find(".video-view");
      this.$milestoneAudioImage = this.$el.find(".module-audio-and-image");
      this.$milestonePlayer = this.$el.find(".module-soundcloud-player");
      this.$milestoneMedia = this.$el.find(".milestone-media");
      this.$milestoneText = this.$el.find(".milestone-text");
      this.$milestoneContent = this.$el.find(".milestone-content");
      this.$milestoneTitle = this.$el.find(".milestone-title-txt");
      this.$milestoneCat = this.$el.find(".milestone-super-title-txt");
      this.$milestoneBody = this.$el.find(".milestone-body-txt");
      this.$milestoneDirBtns = this.$el.find(".milestone-prev-next-txt");
      this.$milestoneCaption = this.$el.find(".milestone-image-caption");
      this.$milestoneCaptionTxt = this.$el.find(".milestone-caption-txt");
      this.$nextButton = this.$el.find(".milestone-next");
      this.$prevButton = this.$el.find(".milestone-prev");
      this.$milestoneClose = this.$el.find(".milestone-close");
      if (this.data.media_type === "video") {
        $video = this.$el.find(".video-view");
        url = this.data.downloaduri || this.data.media_downloaduri;
        this.videoPlayer = new ModuleVideoPlayerView({
          el: $video,
          source: url
        });
      }
      switch (this.data.category.toLowerCase()) {
        case "eisenhower":
          cat = this.data.pivotal_moment_link != null ? "pivotal" : "eisenhower";
          break;
        case "history":
          cat = "contextual";
          break;
      }
      this.$el.addClass(cat);
      if (this.$milestoneImg.length) {
        if (this.$milestoneImg.prop("complete")) {
          return this.onLoad();
        } else {
          return this.$milestoneImg.one("load", function(e) {
            return _this.onLoad(e);
          });
        }
      } else {
        return this.onLoad();
      }
    },
    setTitles: function(prevTitle_, nextTitle_, showPrev_, showNext_) {
      if (showPrev_) {
        this.$prevButton.removeClass("is-invisible").hide().fadeIn().find(".milestone-prev-next-txt").html(prevTitle_);
      } else {
        this.$prevButton.hide();
      }
      if (showNext_) {
        this.$nextButton.removeClass("is-invisible").hide().fadeIn().find(".milestone-prev-next-txt").html(nextTitle_);
      } else {
        this.$nextButton.hide();
      }
      return this.dotDotDot();
    },
    dotDotDot: function() {
      var $btn, btn, _i, _len, _ref, _results;
      _ref = this.$milestoneDirBtns;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        btn = _ref[_i];
        $btn = $(btn);
        $btn.dotdotdot();
        _results.push($btn.css("margin-top", (42 - $btn.height()) * 0.5));
      }
      return _results;
    },
    onLoad: function(e) {
      this.$window.resize();
      return this.$milestoneContent.hide().removeClass("is-invisible").fadeIn();
    },
    onResize: function(height, width) {
      var fontSize, h, mWidth, marginLeft, newW, smallDesktop, tWidth;
      this.height = height;
      this.width = width;
      if (this.height != null) {
        smallDesktop = Modernizr.mq("(max-width: 1169px)");
        this.$milestoneTitle.attr("style", "");
        this.$milestoneContent.attr("style", "");
        this.$milestoneMedia.attr("style", "");
        this.$milestoneVid.attr({
          "style": ""
        });
        h = smallDesktop ? this.height + 106 : this.height;
        this.$el.height(h);
        fontSize = 1.875;
        if (this.$milestoneTitle.height() > this.TITLE_HEIGHT) {
          while (this.$milestoneTitle.height() > this.TITLE_HEIGHT) {
            fontSize -= 0.01;
            this.$milestoneTitle.css("font-size", fontSize + "rem");
          }
        }
        this.resizeMedia(smallDesktop);
        marginLeft = 25;
        mWidth = this.$milestoneMedia.outerWidth();
        tWidth = smallDesktop ? mWidth : this.$milestoneText.outerWidth();
        newW = (mWidth + tWidth + marginLeft) + 5;
        return this.$milestoneContent.width(newW);
      }
    },
    resizeMedia: function(smallScreen_) {
      var canvasW, contentW, h, imgRatio, newH, newW, nonMediaWidth, w;
      if (smallScreen_ == null) {
        smallScreen_ = false;
      }
      if (this.height != null) {
        canvasW = Math.max(960, this.width);
        if (smallScreen_) {
          contentW = canvasW - this.UI_AREA_WIDTH_SMALL;
          nonMediaWidth = contentW * 0.5 - 10;
        } else {
          contentW = canvasW - this.UI_AREA_WIDTH;
          nonMediaWidth = contentW - this.$milestoneText.outerWidth();
        }
        if (this.$milestoneImg.length) {
          w = this.$milestoneImg.width();
          newW = Math.min(w, nonMediaWidth, this.MAX_IMAGE_WIDTH);
          newW = Math.max(newW, this.MIN_IMAGE_WIDTH);
          this.$milestoneMedia.width(newW);
        }
        if (this.$milestoneVid.length) {
          w = 800;
          h = 450;
          imgRatio = h / w;
          newW = Math.min(w, nonMediaWidth, this.MAX_VIDEO_WIDTH);
          newW = Math.max(newW, this.MIN_VIDEO_WIDTH);
          newH = newW * imgRatio;
          this.$milestoneMedia.width(newW);
          this.$milestoneVid.width(newW);
          this.$milestoneVid.height(newH);
        }
        return this.dotDotDot();
      }
    },
    onFullScreenClick: function() {
      var $img, url,
        _this = this;
      if (this.$milestoneImg.length) {
        this.isFullscreen = true;
        url = this.data.fullscreen_image || this.data.fullscreenimage || this.data.downloaduri;
        $img = $("<img />").attr({
          "src": url
        });
        this.$imgWrappper = $("<div class='milestone-overlay-img'/>");
        this.$imgWrappper.mousemove(function(e) {
          var maxY, perc, toY;
          maxY = $img.height() - _this.$window.height();
          perc = e.pageY / _this.$window.height();
          toY = -maxY * perc;
          return $img.css({
            "margin-top": toY
          });
        });
        this.$imgWrappper.click(function() {
          return _this.$imgWrappper.off().fadeOut(function() {
            _this.isFullscreen = false;
            return _this.$imgWrappper.remove();
          });
        });
        this.$imgWrappper.append($img);
        this.$imgWrappper.append("<div class='fullscreen-close'><div class='close-icon'></div></div>");
        return this.$container.append(this.$imgWrappper);
      }
    },
    onCloseClick: function() {
      return this.destroy(true);
    },
    onPrevClick: function() {
      return this.trigger(this.PREV);
    },
    onNextClick: function() {
      return this.trigger(this.NEXT);
    },
    destroy: function(fade_) {
      var destoryComplete,
        _this = this;
      this.$milestoneImg.off();
      if (this.$imgWrappper) {
        this.$imgWrappper.off();
      }
      destoryComplete = function() {
        _this.isDestroyed = true;
        _this.$el.remove();
        AbstractItemView.prototype.destroy.call(_this);
        return _this.trigger(_this.DESTROY, fade_);
      };
      if (fade_) {
        this.$body.css({
          "overflow-y": "auto"
        });
        return this.$el.fadeOut(destoryComplete);
      } else {
        return destoryComplete();
      }
    }
  });
});
