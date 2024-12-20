define(["underscore", "backbone", "marionette"], function(_, Backbone, Marionette) {
  var AbstractLayoutView;
  return AbstractLayoutView = Marionette.LayoutView.extend({
    isMobile: false,
    isPortrait: false,
    isInit: true,
    initialize: function() {
      this.$window = $(window);
      this.$body = $("body");
      return this.$html = $("html");
    },
    pagination: function() {},
    onScroll: function(scrollTop_) {},
    onResize: function(height_, width_) {
      this.isMobile = Modernizr.mq("(max-width: " + app.appConfig.sizing.mobile + "px)");
      return this.isPortrait = Modernizr.mq("(max-width: " + app.appConfig.sizing.mobile_portrait + "px)");
    }
  });
});
