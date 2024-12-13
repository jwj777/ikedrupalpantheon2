define(["underscore", "backbone", "marionette", "jquery"], function(_, Backbone, Marionette, $) {
  var LPTimelineAbstractLayoutView;
  return LPTimelineAbstractLayoutView = Marionette.LayoutView.extend({
    pagination: function() {
      return console.log("override");
    }
  });
});
