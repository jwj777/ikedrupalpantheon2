define(["jquery", "underscore", "backbone", "lp_timeline/views/LPTimelineAbstractItemView"], function($, _, Backbone, LPTimelineAbstractItemView) {
  var LPTimelineModuleImageView;
  return LPTimelineModuleImageView = LPTimelineAbstractItemView.extend({
    LAUNCH_MODAL: "LPTimelineModuleImageView.LAUNCH_MODAL",
    events: {
      "click": "onClick"
    },
    initialize: function(args_) {
      var args,
        _this = this;
      LPTimelineAbstractItemView.prototype.initialize.call(this);
      args = args_ || {};
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
