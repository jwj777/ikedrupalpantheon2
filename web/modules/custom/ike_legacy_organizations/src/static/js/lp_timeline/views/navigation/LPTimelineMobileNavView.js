define(["underscore", "backbone", "jquery", "lp_timeline/views/LPTimelineAbstractItemView", "lp_timeline/views/modules/LPTimelineSocialIconView"], function(_, Backbone, $, LPTimelineAbstractItemView, LPTimelineSocialIconView) {
  var LPTimelineMobileNavView;
  return LPTimelineMobileNavView = LPTimelineAbstractItemView.extend({
    HAMBURGER_CLICK: "LPTimelineMobileNavView.HAMBURGER_CLICK",
    events: {
      "click .hamburger": "onHamburgerClick"
    },
    onHamburgerClick: function() {
      return this.trigger(this.HAMBURGER_CLICK);
    }
  });
});
