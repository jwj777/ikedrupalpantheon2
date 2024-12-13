define(["jquery", "underscore", "backbone", "transit", "grid-gallery", "hammer", "lazy", "dotdotdot", "fastdom", "lp_timeline/views/LPTimelineAbstractItemView", "lp_timeline/views/modules/LPTimelineModuleAudioView", "lp_timeline/views/modules/LPTimelineModuleVideoPlayer", "text!partial/modal-template.html"], function($, _, Backbone, trans, gridGallery, Hammer, lazy, dot, fastdom, LPTimelineAbstractItemView, LPTimelineModuleAudioView, LPTimelineModuleVideoPlayer, template) {
  var LPTimelineAssetsModalView;
  return LPTimelineAssetsModalView = LPTimelineAbstractItemView.extend({
    MODAL_CLOSE: "LPTimelineAssetsModalView.MODAL_CLOSE",
    events: {
      "click .asset-click": "onCloseClick",
      "click .asset-modal-close": "onCloseClick",
      "click .asset-modal-prev": "onPrevClick",
      "click .asset-modal-next": "onNextClick",
      "click .asset-modal-nav-dot": "onNavClick"
    },
    index: 0,
    modal_template: _.template(template),
    initialize: function(args_) {
      var self, viewData,
        _this = this;
      self = this;
      this.waveID = "wave_" + Math.floor(Date.now() / 1000);
      this.type = args_.type;
      viewData = {
        data: this.model,
        type: this.type
      };
      this.images = this.model.images;
      if (this.images) {
        this.total = this.images.length;
      }
      this.$el = $(this.modal_template(viewData));
      this.$window = $(window);
      this.$prevArrow = this.$el.find(".asset-modal-prev");
      this.$prevText = this.$prevArrow.find(".asset-modal-prev-next-txt");
      this.$nextArrow = this.$el.find(".asset-modal-next");
      this.$nextText = this.$nextArrow.find(".asset-modal-prev-next-txt");
      this.$el.fadeIn();
      return app.utils.delay(100, function() {
        var $audio, $video;
        _this.initDivs();
        switch (_this.type) {
          case "gallery":
            _this.setSlideIndex();
            _this.dupeSlides();
            _this.initHammer();
            _this.$slides.find("picture, img").each(function(i, e) {
              return $(e).load(function() {
                return self.onSlideResize();
              });
            });
            $(document).on('lazybeforeunveil', function() {
              _this.onSlideResize();
              app.utils.delay(100, function() {
                return _this.onSlideResize();
              });
              app.utils.delay(500, function() {
                return _this.onSlideResize();
              });
              return app.utils.delay(1000, function() {
                return _this.onSlideResize();
              });
            });
            _.bindAll(_this, 'onKeyPress');
            $(document).bind('keydown', function(e) {
              return _this.onKeyPress(e);
            });
            break;
          case "audioAndImages":
            $audio = _this.$el.find(".module-audio-and-image");
            _this.moduleAudioView = new LPTimelineModuleAudioView({
              el: $audio
            });
            break;
          case "video":
            $video = _this.$el.find(".video-view");
            _this.videoPlayer = new LPTimelineModuleVideoPlayer({
              el: $video,
              source: _this.model.mediauri
            });
            break;
        }
      });
    },
    initDivs: function() {
      var self;
      self = this;
      this.$titleTxt = this.$el.find(".asset-modal-text .asset-modal-title-txt");
      this.$captionTxt = this.$el.find(".asset-modal-text .asset-modal-caption-txt");
      this.$creditTxt = this.$el.find(".asset-modal-text .asset-modal-credit-txt");
      this.$counterTxt = this.$el.find(".asset-modal-counter-txt");
      this.$slideshow = this.$el.find(".asset-modal-slideshow");
      this.$slides = this.$el.find(".asset-modal-slide");
      this.$dots = this.$el.find(".hide-device .asset-modal-nav-dot");
      this.$content = this.$el.find(".asset-modal-content");
      this.bottomeText = this.$el.find(".asset-modal-slideshow-desktop");
      this.$slideshow.width(100 * (this.total + 2) + "%");
      return this.$slides.width(100 / (this.total + 2) + "%");
    },
    dupeSlides: function() {
      var $first, $last;
      $first = this.$slides.first().clone().addClass("clone");
      $last = this.$slides.last().clone().addClass("clone");
      $first.appendTo(this.$slideshow);
      return $last.prependTo(this.$slideshow);
    },
    initHammer: function() {
      var hammertime, lastDelta, lastX, orgX, self,
        _this = this;
      lastX = 0;
      lastDelta = 0;
      orgX = 0;
      self = this;
      hammertime = new Hammer(this.$slideshow[0]);
      hammertime.on("panstart", function(e) {
        return orgX = lastX = _this.$slideshow.position().left;
      });
      hammertime.on("panmove", function(e) {
        var left;
        left = lastX + e.deltaX;
        return _this.$slideshow.css("left", left);
      });
      return hammertime.on("panend pancancel", function(e) {
        if (e.deltaX < -100) {
          return self.onNextClick();
        } else if (e.deltaX > 100) {
          return self.onPrevClick();
        } else {
          return _this.$slideshow.animate({
            "left": orgX
          }, 150);
        }
      });
    },
    setSlideIndex: function(index, resetIndex_) {
      var _this = this;
      if (index == null) {
        index = 0;
      }
      if (this.animating) {
        return;
      }
      return fastdom.mutate(function() {
        var data, eq, int, length, nextIndex, prevIndex;
        _this.index = index;
        data = resetIndex_ !== void 0 ? _this.images[resetIndex_] : _this.images[_this.index];
        eq = resetIndex_ !== void 0 ? resetIndex_ : _this.index;
        _this.setText(data);
        _this.animating = true;
        _this.$dots.removeClass("active").eq(eq).addClass("active");
        int = resetIndex_ !== void 0 ? resetIndex_ + 1 : _this.index + 1;
        _this.$counterTxt.html("" + int + " of " + _this.images.length);
        _this.$slideshow.transition({
          "left": -100 * (_this.index + 1) + "%"
        }, function() {
          var newLeft;
          if (resetIndex_ !== void 0) {
            _this.index = resetIndex_;
          }
          _this.animating = false;
          if (resetIndex_ !== void 0) {
            newLeft = -100 * (resetIndex_ + 1);
            return _this.$slideshow.css({
              "left": newLeft + "%"
            });
          }
        });
        length = _this.images.length;
        if (_this.index === length - 1) {
          _this.$nextArrow.hide();
        } else {
          nextIndex = _this.index + 1;
          _this.$nextArrow.show();
          _this.$nextText.html(_this.images[nextIndex].title);
          _this.$nextText.dotdotdot();
          _this.$nextText.css("margin-top", (40 - _this.$nextText.height()) * 0.5);
        }
        if (_this.index === 0) {
          return _this.$prevArrow.hide();
        } else {
          prevIndex = _this.index - 1;
          _this.$prevArrow.show();
          _this.$prevText.html(_this.images[prevIndex].title);
          _this.$prevText.dotdotdot();
          return _this.$prevText.css("margin-top", (40 - _this.$prevText.height()) * 0.5);
        }
      });
    },
    setText: function(textObj_) {
      if (textObj_) {
        this.$titleTxt.html(textObj_.title);
        this.$captionTxt.html(textObj_.caption);
        this.$creditTxt.html(textObj_.credit);
      }
      return this.onResize(this.$window.height(), this.$window.width());
    },
    onSlideResize: function() {
      var _this = this;
      if (this.type === "gallery") {
        if (this.isBelowTablet) {
          return fastdom.mutate(function() {
            return _this.$slides.find("img").attr({
              "style": ""
            });
          });
        } else {
          return fastdom.measure(function() {
            var $slide, btHeight, h, imgRatio, maxHeight, maxWidth, newH, newW, slide, w, _i, _len, _ref, _results;
            btHeight = _this.bottomeText.length ? _this.bottomeText.height() : 0;
            maxHeight = _this.$window.height() - btHeight - 40;
            maxWidth = _this.$window.width() - 434;
            _ref = _this.$slides;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              slide = _ref[_i];
              $slide = $(slide).find("img");
              w = $slide.attr({
                "style": ""
              }).width();
              h = $slide.attr({
                "style": ""
              }).height();
              if (w && h) {
                newH = h;
                newW = w;
                imgRatio = w / h;
                if (w > maxWidth || h > maxHeight) {
                  newH = maxHeight;
                  newW = maxHeight * imgRatio;
                }
                if (newW > maxWidth) {
                  newW = maxWidth;
                  newH = newW * (1 / imgRatio);
                }
                _results.push((function($slide, newW, newH) {
                  return fastdom.mutate(function() {
                    $slide.width(newW);
                    return $slide.height(newH);
                  });
                })($slide, newW, newH));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          });
        }
      }
    },
    onKeyPress: function(e) {
      if (e.keyCode === 39) {
        this.onNextClick();
      }
      if (e.keyCode === 37) {
        return this.onPrevClick();
      }
    },
    onNavClick: function(e) {
      var $btn, index;
      $btn = $(e.currentTarget);
      index = $btn.index();
      if (index >= 0) {
        return this.setSlideIndex(index);
      }
    },
    onCloseClick: function() {
      var _this = this;
      this.trigger(this.MODAL_CLOSE);
      return this.$el.fadeOut(function() {
        return _this.destroy();
      });
    },
    onPrevClick: function() {
      var newIndex, resetIndex;
      if (this.animating || (this.index === 0 && !this.isBelowTablet)) {
        return;
      }
      newIndex = this.index - 1;
      if (this.index === 0) {
        resetIndex = this.total - 1;
      }
      return this.setSlideIndex(newIndex, resetIndex);
    },
    onNextClick: function() {
      var newIndex, resetIndex;
      if (this.animating || (this.index === this.images.length - 1 && !this.isBelowTablet)) {
        return;
      }
      newIndex = this.index + 1;
      if (this.index === (this.total - 1)) {
        resetIndex = 0;
      }
      return this.setSlideIndex(newIndex, resetIndex);
    },
    onResize: function(height, width) {
      this.height = height;
      this.width = width;
      LPTimelineAbstractItemView.prototype.onResize(this.height, this.width);
      if (this.videoPlayer) {
        this.videoPlayer.resize(this.height, this.width);
      }
      return this.onSlideResize();
    },
    destroy: function() {
      var _this = this;
      $(document).off('lazybeforeunveil', function() {
        _this.onSlideResize();
        return app.utils.delay(1000, function() {
          return _this.onSlideResize();
        });
      });
      $(document).off('keydown', function(e) {
        return _this.onKeyPress(e);
      });
      if (this.moduleAudioView != null) {
        this.moduleAudioView.destroy();
      }
      if (this.videoPlayer != null) {
        this.videoPlayer.destroy();
      }
      return LPTimelineAbstractItemView.prototype.destroy.call(this);
    }
  });
});
