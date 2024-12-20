define(["jquery", "underscore", "backbone", "lp_timeline/views/LPTimelineAbstractItemView"], function($, _, Backbone, LPTimelineAbstractItemView) {
  var LPTimelineModuleVideoView;
  return LPTimelineModuleVideoView = LPTimelineAbstractItemView.extend({
    LAUNCH_MODAL: "LPTimelineModuleVideoView.LAUNCH_MODAL",
    events: {
      "click": "onClick"
    },
    initialize: function(args_) {
      var _this = this;
      LPTimelineAbstractItemView.prototype.initialize.call(this);
      this.model = this.$el.find('.module-data').data();
      return this.$el.find('img').load(function() {
        return $(window).resize();
      });
    },
    onClick: function() {
      return this.trigger(this.LAUNCH_MODAL, this);
    }
  });
});
