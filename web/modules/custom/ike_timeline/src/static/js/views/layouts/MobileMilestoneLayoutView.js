define(["jquery", "underscore", "backbone", "dotdotdot", "hammer", "views/module/MobileModuleAudioView", "views/module/ModuleVideoPlayerView", "abstract-layout"], function($, _, Backbone, dotdotdot, hammer, MobileModuleAudioView, ModuleVideoPlayerView, AbstractLayoutView) {
  var MobileMilestoneLayoutView;
  return MobileMilestoneLayoutView = AbstractLayoutView.extend({
    PREPARE: "PREPARE",
    PREV: "PREV",
    NEXT: "NEXT",
    DESTROY: "DESTROY",
    initialize: function(options) {
      var options_, self,
        _this = this;
      self = this;
      options_ = options.options_;
      this.data = options_.data;
      this.currentMilestone = options_.currentMilestone;
      this.currentIndex = options_.currentIndex;
      this.currentId = this.currentMilestone.id;
      this.slideDirection = options_.slideDirection;
      this.milestoneURL = window.base_url + "/timeline/milestone/" + this.currentId + '/mobile';
      return $.ajax({
        url: this.milestoneURL,
        dataType: "html",
        context: self,
        success: function(milestoneTemplate) {
          var endPos, mt, startPos;
          mt = $(milestoneTemplate);
          if (_this.slideDirection === "fade") {
            $(mt).fadeIn('fast');
            $('.milestone-container').prepend(mt);
          } else if (_this.slideDirection === "left") {
            startPos = window.innerWidth;
            endPos = 0;
            $(mt).css({
              "left": startPos
            });
            $('.milestone-container').prepend(mt);
            $(mt).animate({
              left: endPos
            }, {
              'duration': 400,
              'easing': 'linear',
              complete: function() {}
            });
            _this.slideMilestone("left");
          } else {
            startPos = -window.innerWidth;
            endPos = 0;
            $(mt).css({
              "left": startPos
            });
            $('.milestone-container').prepend(mt);
            $(mt).animate({
              left: endPos
            }, {
              'duration': 400,
              'easing': 'linear',
              complete: function() {}
            });
            _this.slideMilestone("right");
          }
          _this.trigger(_this.PREPARE);
          $(".loading-screen").removeClass('active');
          _this.setState(mt);
          return _this.initHammerInstance();
        },
        error: function(err) {
          return console.log("error", err);
        }
      });
    },
    setState: function(mt) {
      var $video, np, pn, prevNextElems, self, _i, _len,
        _this = this;
      self = this;
      this.$el = mt;
      np = this.getNextPrev();
      $(".milestone-prev").find(".milestone-prev-next-txt").html(np.prevTitle);
      $(".milestone-next").find(".milestone-prev-next-txt").html(np.nextTitle);
      prevNextElems = $(".milestone-prev-next-txt");
      for (_i = 0, _len = prevNextElems.length; _i < _len; _i++) {
        pn = prevNextElems[_i];
        if ($(pn).html().length > 20) {
          $(pn).dotdotdot();
        }
      }
      $(".milestone-next").click(function() {
        return _this.trigger(self.NEXT);
      });
      $(".milestone-prev").click(function() {
        return _this.trigger(self.PREV);
      });
      this.$el.find(".milestone-close").click(function() {
        _this.trigger(self.DESTROY);
        return self.destroy();
      });
      switch (this.currentMilestone.media_type) {
        case "video":
          $video = $(document).find(".video-view");
          this.videoPlayer = new ModuleVideoPlayerView({
            el: $video,
            source: this.currentMilestone.media_downloaduri
          });
          break;
      }
    },
    initHammerInstance: function() {
      var currentEl, err, self;
      self = this;
      currentEl = $(".milestone");
      this.hammerInstance = new hammer(currentEl[0]);
      try {
        if (this.hammerInstance) {
          this.hammerInstance.get('swipe').set({
            threshold: 1
          });
          this.hammerInstance.get('pan').set({
            threshold: 15
          });
          this.hammerInstance.on('panleft', function(event) {
            var leftVal, mlWidth;
            $(".milestone").css("left", 0 + event.deltaX);
            leftVal = $(".milestone").css("left");
            if (parseInt(leftVal) !== NaN) {
              leftVal = parseInt(leftVal);
            }
            mlWidth = $(".milestone").width();
            if (Math.abs(leftVal) > (mlWidth * 0.1) || event.velocityX > 1) {
              self.trigger(self.NEXT);
              if (this.hammerInstance) {
                return this.hammerInstance.destroy();
              }
            } else {
              return $(".milestone").css("left", 0);
            }
          });
          this.hammerInstance.on('panright', function(event) {
            var leftVal, mlWidth;
            $(".milestone").css("left", 0 + event.deltaX);
            leftVal = $(".milestone").css("left");
            if (parseInt(leftVal) !== NaN) {
              leftVal = parseInt(leftVal);
            }
            mlWidth = $(".milestone").width();
            if (Math.abs(leftVal) > (mlWidth * 0.1) || event.velocityX > 1) {
              self.trigger(self.PREV);
              if (this.hammerInstance) {
                return this.hammerInstance.destroy();
              }
            } else {
              return $(".milestone").css("left", 0);
            }
          });
          this.hammerInstance.on('swipeleft', function(event) {
            $(".milestone").css("left", 0 + event.deltaX);
            self.trigger(self.NEXT);
            if (this.hammerInstance) {
              return this.hammerInstance.destroy();
            }
          });
          return this.hammerInstance.on('swiperight', function(event) {
            $(".milestone").css("left", 0 + event.deltaX);
            self.trigger(self.PREV);
            if (this.hammerInstance) {
              return this.hammerInstance.destroy();
            }
          });
        } else {
          throw new Error("Undefined HammerInstance");
        }
      } catch (_error) {
        err = _error;
        return console.log(err);
      }
    },
    getNextPrev: function() {
      var length, nextId, nextIndex, nextTitle, prevId, prevIndex, prevTitle;
      length = this.data.length;
      nextIndex = this.currentIndex === length - 1 ? 0 : this.currentIndex + 1;
      prevIndex = this.currentIndex === 0 ? length - 1 : this.currentIndex - 1;
      nextTitle = this.data[nextIndex].title;
      nextId = this.data[nextIndex].id;
      prevTitle = this.data[prevIndex].title;
      prevId = this.data[prevIndex].id;
      return {
        "nextTitle": nextTitle,
        "nextId": nextId,
        "prevTitle": prevTitle,
        "prevId": prevId
      };
    },
    slideMilestone: function(direction) {
      var self;
      self = this;
      if (direction === "left") {
        return $(".milestone:nth-child(2)").animate({
          left: -window.innerWidth
        }, {
          'duration': 400,
          'easing': 'linear',
          complete: function() {
            return $(this).remove();
          }
        });
      } else {
        return $(".milestone:nth-child(2)").animate({
          left: window.innerWidth
        }, {
          'duration': 400,
          'easing': 'linear',
          complete: function() {
            return $(this).remove();
          }
        });
      }
    },
    destroy: function() {
      $(".milestone").fadeOut("fast", function() {
        return $(this).remove();
      });
      $(".milestone-links").fadeOut("fast", function() {
        return $(this).remove();
      });
      return AbstractLayoutView.prototype.destroy.call(this);
    }
  });
});
