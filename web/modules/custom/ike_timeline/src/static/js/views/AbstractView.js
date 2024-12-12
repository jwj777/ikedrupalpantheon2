define(["underscore", "backbone"], function(_, Backbone) {
  var AbstractView;
  return AbstractView = Backbone.View.extend({
    parent: "body",
    templateDir: "/static/templates/",
    viewData: {},
    results: [],
    templateLoaded: false,
    delayedCollectionLoad: false,
    ON_TEMPLATE_LOAD: "AbstractView.ON_TEMPLATE_LOAD",
    initialize: function(options_) {
      var options;
      this.$window = $(window);
      this.$body = $("body");
      this.$html = $("html");
      options = options_ || {};
      this.id = options.id || this.id;
      this.templateDir = options.templateDir || this.templateDir;
      this.parent = options.parent || this.parent;
      return this.viewData = options.viewData || this.viewData;
    },
    onTemplateLoad: function() {
      this.templateLoaded = true;
      this.trigger(this.ON_TEMPLATE_LOAD);
      if (this.delayedCollectionLoad) {
        this.loadData();
      }
      this.delegateEvents();
      return onPageElementsLoad();
    },
    show: function() {
      return this.$el.show();
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
    changeHash: function(e) {
      return window.location.hash = $(e.currentTarget).attr("href").substring(1);
    },
    onFetch: function(r) {}
  });
});
