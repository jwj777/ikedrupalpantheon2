define(["jquery", "underscore", "backbone", "wavesurfer", "lp_timeline/views/LPTimelineAbstractItemView"], function($, _, Backbone, wavesurfer, LPTimelineAbstractItemView) {
  var LPTimelineModuleAudioView;
  return LPTimelineModuleAudioView = LPTimelineAbstractItemView.extend({
    events: {
      "click": "onClick"
    },
    initialize: function() {
      this.isReady = false;
      this.model = this.$el.find('.module-data').data();
      return LPTimelineAbstractItemView.prototype.initialize.call(this);
    },
    loadAudio: function(autoPlay_) {
      var $pauseBtn, $play, $playBtn, $preload, $remain, $total, e, id, self, updateDisplay, url,
        _this = this;
      if (this.ws) {
        return;
      }
      console.log('LPTimelineModuleAudioView loadAudio');
      $play = this.$el.find('.module-audio-player');
      $playBtn = this.$el.find('.audioplay-icon');
      $pauseBtn = this.$el.find('.audiopause-icon');
      $remain = this.$el.find('.remaining');
      $preload = this.$el.find('.module-audio-preload');
      $total = this.$el.find('.total');
      this.$el.find('.module-audio-click-text').remove();
      $preload.show();
      self = this;
      this.ws = Object.create(WaveSurfer);
      url = this.model.mediauri;
      id = this.model.id || 'wave';
      try {
        this.ws.init({
          container: $('#' + id).get(0),
          waveColor: '#666',
          progressColor: '#81c0c6',
          barWidth: 2,
          height: 62,
          hideScrollbar: true
        });
        this.ws.on('ready', function() {
          updateDisplay();
          $preload.remove();
          if (autoPlay_) {
            _this.ws.playPause();
          }
          _this.isReady = true;
          $playBtn.click(function() {
            return _this.ws.playPause();
          });
          return $pauseBtn.click(function() {
            return _this.ws.playPause();
          });
        });
        this.ws.on('play', function() {
          $playBtn.toggle();
          $pauseBtn.toggle();
          return $play.addClass('pause');
        });
        this.ws.on('pause', function() {
          $playBtn.toggle();
          $pauseBtn.toggle();
          return $play.removeClass('pause');
        });
        this.ws.on('audioprocess', function() {
          return updateDisplay();
        });
        this.ws.load(url);
      } catch (_error) {
        e = _error;
        console.log("AUDIO ERROR", e);
      }
      return updateDisplay = function() {
        var current, total;
        current = app.utils.millisecondsToTime(self.ws.getCurrentTime() * 1000);
        total = app.utils.millisecondsToTime(self.ws.getDuration() * 1000);
        $remain.text(current);
        return $total.text(total);
      };
    },
    redraw: function() {
      if (this.isReady) {
        this.ws.empty();
        return this.ws.drawBuffer();
      }
    },
    stop: function() {
      if (this.isReady) {
        if (this.ws.isPlaying()) {
          return this.ws.pause();
        }
      }
    },
    onClick: function() {
      if (this.isMobile) {
        return this.loadAudio(true);
      }
    },
    destroy: function() {
      this.ws = null;
      return LPTimelineAbstractItemView.prototype.destroy.call(this);
    }
  });
});
