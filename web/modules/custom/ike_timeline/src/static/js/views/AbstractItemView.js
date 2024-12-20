define(["underscore", "backbone", "marionette"], function(_, Backbone, Marionette) {
  var AbstractItemView;
  return AbstractItemView = Marionette.ItemView.extend({
    parent: "body",
    templateDir: "/static/templates/",
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
      this.$window = $(window);
      this.$body = $("body");
      this.$html = $("html");
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
      var item, _i, _len, _ref, _results;
      this.height = height;
      this.width = width;
      this.isMobile = Modernizr.mq("(max-width: " + app.appConfig.sizing.mobile + "px)");
      _ref = this.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(item.onResize(this.height, this.width));
      }
      return _results;
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
    hide: function() {
      return this.$el.hide();
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
