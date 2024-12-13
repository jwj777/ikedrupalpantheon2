define(["jquery", "underscore", "backbone", "grid-gallery", "slick", "lp_timeline/views/LPTimelineAbstractItemView"], function($, _, Backbone, gridGallery, slick, LPTimelineAbstractItemView) {
  var LPTimelineModuleGalleryView;
  return LPTimelineModuleGalleryView = LPTimelineAbstractItemView.extend({
    LAUNCH_MODAL: "LPTimelineModuleGalleryView.LAUNCH_MODAL",
    events: {
      "click": "onClick"
    },
    initialize: function(args_) {
      var img, _i, _len, _ref, _results,
        _this = this;
      LPTimelineAbstractItemView.prototype.initialize.call(this);
      this.model = this.$el.find('.module-data').data();
      if (typeof this.model.images === 'string' || this.model.images instanceof String) {
        this.model.images = this.model.images.replace(/'/g, "\"").trim();
        this.model.images = $.parseJSON(this.model.images);
      }
      _ref = this.$el.find('img');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        img = _ref[_i];
        _results.push($(img).load(function() {
          return $(window).resize();
        }));
      }
      return _results;
    },
    onClick: function() {
      return this.trigger(this.LAUNCH_MODAL, this);
    }
  });
});
