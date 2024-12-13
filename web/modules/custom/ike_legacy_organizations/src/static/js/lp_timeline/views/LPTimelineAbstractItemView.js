define(["underscore", "backbone", "marionette", "fastdom", "jquery"], function(_, Backbone, Marionette, fastdom, $) {
  var LPTimelineAbstractItemView;
  return LPTimelineAbstractItemView = Marionette.ItemView.extend({
    parent: "body",
    templateDir: "/legacy/static/templates/",
    template: false,
    viewData: {},
    results: [],
    items: [],
    templateLoaded: false,
    delayedCollectionLoad: false,
    height: 0,
    width: 0,
    initialize: function(options_) {
      var options;
      options = options_ || {};
      this.id = options.id || this.id;
      this.templateDir = options.templateDir || this.templateDir;
      this.parent = options.parent || this.parent;
      this.viewData = options.viewData || this.viewData;
      if (!this.$el) {
        this.$el = $(this.get("el"));
      }
      return Marionette.ItemView.prototype.initialize.call(this);
    },
    onResize: function(height, width) {
      var _this = this;
      this.height = height;
      this.width = width;
      return fastdom.measure(function() {
        var item, _i, _len, _ref, _results;
        _this.isMobile = Modernizr.mq("(max-width: " + app.appConfig.sizing.mobile + "px)");
        _this.isPhone = Modernizr.mq("(max-width: " + app.appConfig.sizing.phone + "px)");
        _this.isBelowTablet = Modernizr.mq("(max-width: " + (app.appConfig.sizing.below_tablet - 1) + "px)");
        _ref = _this.items;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _results.push(item.onResize(_this.height, _this.width));
        }
        return _results;
      });
    },
    onScroll: function(scrollTop_) {
      var item, _i, _len, _ref, _results;
      _ref = this.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(item.onScroll(scrollTop_));
      }
      return _results;
    },
    show: function() {
      Marionette.ItemView.prototype.show.call(this);
      return app.utils.deHash();
    },
    fetch: function() {
      var _this = this;
      return this.model.fetch({
        success: function(r) {
          return _this.onFetch(r);
        }
      });
    },
    onFetch: function(r) {},
    destroy: function() {
      return Marionette.ItemView.prototype.destroy.call(this);
    }
  });
});
