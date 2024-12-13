define(["jquery", "underscore", "backbone", "wavesurfer", "lp_timeline/views/modules/LPTimelineModuleAudioView"], function($, _, Backbone, wavesurfer, LPTimelineModuleAudioView) {
  var LPTimelineModuleAudioAndImageView;
  return LPTimelineModuleAudioAndImageView = LPTimelineModuleAudioView.extend({
    events: {
      "click .module-audio-image": "onClick"
    },
    initialize: function() {
      var _this = this;
      this.$el.find('img').load(function() {
        return $(window).resize();
      });
      return LPTimelineModuleAudioView.prototype.initialize.call(this);
    },
    onClick: function() {
      return this.trigger(this.LAUNCH_MODAL, this);
    }
  });
});
