define(["jquery", "underscore", "backbone", "masonry", "lp_timeline/views/LPTimelineAbstractItemView", "lp_timeline/views/modals/LPTimelineAssetsModalView", "lp_timeline/views/modules/LPTimelineModuleAudioView", "lp_timeline/views/modules/LPTimelineModuleAudioAndImageView", "lp_timeline/views/modules/LPTimelineModuleGalleryView", "lp_timeline/views/modules/LPTimelineModuleImageView", "lp_timeline/views/modules/LPTimelineModuleVideoView"], function($, _, Backbone, Masonry, LPTimelineAbstractItemView, LPTimelineAssetsModalView, LPTimelineModuleAudioView, LPTimelineModuleAudioAndImageView, LPTimelineModuleGalleryView, LPTimelineModuleImageView, LPTimelineModuleVideoView) {
  var LPTimelineSlideView;
  return LPTimelineSlideView = LPTimelineAbstractItemView.extend({
    initialize: function(args_) {
      var args;
      LPTimelineAbstractItemView.prototype.initialize.call(this);
      this.audio = [];
      args = args_ || {};
      this.$imgWrapper = this.$el.find(".img-full-wrapper");
      this.$sectionContent = this.$el.find(".section-content");
      this.$intro = this.$el.find(".intro");
      this.$media = this.$el.find(".media");
      this.isIntro = this.$intro.length;
      this.bodyHtml = $("html, body");
      this.$siteContainer = $("#container");
      this.$allBlur = $(".img-full-wrapper, .section-content");
      this.initAudio();
      this.initAudioAndImages();
      this.initGallery();
      this.initImages();
      this.initVideo();
      return this.initMasonry();
    },
    initAudio: function() {
      var _this = this;
      return this.$el.find(".module-audio").each(function(i_, el_) {
        var moduleAudioView;
        moduleAudioView = new LPTimelineModuleAudioView({
          el: el_
        });
        return _this.audio.push(moduleAudioView);
      });
    },
    initAudioAndImages: function() {
      var _this = this;
      return this.$el.find(".module-audio-and-image").each(function(i_, el_) {
        var moduleAudioView;
        moduleAudioView = new LPTimelineModuleAudioAndImageView({
          el: el_
        });
        moduleAudioView.on(moduleAudioView.LAUNCH_MODAL, function(e) {
          return _this.loadAssetModal("audioAndImages", e);
        });
        return _this.audio.push(moduleAudioView);
      });
    },
    initGallery: function() {
      var _this = this;
      return this.$el.find(".module-gallery").each(function(i_, el_) {
        var moduleGalleryView;
        moduleGalleryView = new LPTimelineModuleGalleryView({
          el: el_
        });
        return moduleGalleryView.on(moduleGalleryView.LAUNCH_MODAL, function(e) {
          return _this.loadAssetModal("gallery", e);
        });
      });
    },
    initImages: function() {
      var _this = this;
      return this.$el.find(".module-image").each(function(i_, el_) {
        var moduleImageView;
        moduleImageView = new LPTimelineModuleImageView({
          el: el_
        });
        return moduleImageView.on(moduleImageView.LAUNCH_MODAL, function(e) {
          return _this.loadAssetModal("image", e);
        });
      });
    },
    initVideo: function() {
      var _this = this;
      return this.$el.find(".module-video").each(function(i_, el_) {
        var moduleVideoView;
        moduleVideoView = new LPTimelineModuleVideoView({
          el: el_
        });
        return moduleVideoView.on(moduleVideoView.LAUNCH_MODAL, function(e) {
          return _this.loadAssetModal("video", e);
        });
      });
    },
    initMasonry: function() {
      var img, onLoaded, self;
      self = this;
      this.destoryMasonry();
      if (this.$media.length) {
        this.msnry = new Masonry(this.$media.get(0), {
          itemSelector: ".grid-item",
          columnWidth: ".grid-sizer"
        });
        onLoaded = function() {
          if (self.msnry) {
            return self.msnry.layout();
          }
        };
        img = this.$el.find("img");
        if (img[0] && img[0].complete) {
          return onLoaded();
        } else {
          return img.load(function() {
            return onLoaded();
          });
        }
      }
    },
    destoryMasonry: function() {
      var msnry;
      if (this.msnry && this.$media.length) {
        msnry = Masonry.data(this.$media.get(0));
        msnry.destroy();
        return this.msnry = null;
      }
    },
    loadAssetModal: function(type_, module_) {
      var _this = this;
      this.destroyModal();
      if (this.isMobile) {
        this.bodyHtml.css({
          "overflow-y": "hidden"
        });
      }
      this.assetsModalView = new LPTimelineAssetsModalView({
        type: type_,
        model: module_.model
      });
      this.assetsModalView.on(this.assetsModalView.MODAL_CLOSE, function() {
        _this.$allBlur.removeClass("blur");
        if (_this.isMobile) {
          return _this.bodyHtml.css({
            "overflow-y": "auto"
          });
        }
      });
      this.$siteContainer.append(this.assetsModalView.$el);
      return fastdom.mutate(function() {
        return _this.$allBlur.addClass("blur");
      });
    },
    loadAudio: function() {
      var audio, _i, _len, _ref, _results;
      if (!this.isMobile) {
        _ref = this.audio;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          audio = _ref[_i];
          _results.push(audio.loadAudio());
        }
        return _results;
      }
    },
    turnOffAudio: function() {
      var audio, _i, _len, _ref, _results;
      _ref = this.audio;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        audio = _ref[_i];
        _results.push(audio.stop());
      }
      return _results;
    },
    onResize: function(height, width) {
      var _this = this;
      this.height = height;
      this.width = width;
      LPTimelineAbstractItemView.prototype.onResize(this.height, this.width);
      if (this.assetsModalView) {
        this.assetsModalView.onResize(this.height, this.width);
      }
      if (this.isMobile) {
        fastdom.mutate(function() {
          _this.$imgWrapper.height("");
          if (!_this.wasMobile) {
            return _this.destoryMasonry();
          }
        });
      } else {
        fastdom.measure(function() {
          var outerHeight;
          outerHeight = _this.$sectionContent.outerHeight();
          return fastdom.mutate(function() {
            _this.$imgWrapper.height(Math.max(outerHeight, _this.height));
            if (_this.wasMobile) {
              return _this.initMasonry();
            }
          });
        });
      }
      fastdom.mutate(function() {
        var audio, _i, _len, _ref, _results;
        _ref = _this.audio;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          audio = _ref[_i];
          audio.onResize(_this.height, _this.width);
          _results.push(audio.redraw());
        }
        return _results;
      });
      return this.wasMobile = this.isMobile;
    },
    destroyModal: function() {
      var _this = this;
      if (this.assetsModalView) {
        this.assetsModalView.destroy();
        this.assetsModalView = null;
      }
      return fastdom.mutate(function() {
        _this.$imgWrapper.removeClass("blur");
        return _this.$sectionContent.removeClass("blur");
      });
    }
  });
});
