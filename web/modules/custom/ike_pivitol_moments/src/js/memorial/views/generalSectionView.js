// Generated by CoffeeScript 1.8.0
(function() {
  define(["underscore", "backbone"], function(_, Backbone) {
    return Backbone.View.extend({
      className: "general-section-view",
      tagName: "section",
      initialize: function(args) {
        if (args) {
          this.template = args.template;
        }
        return this.render();
      },
      render: function() {
        if (this.template && this.model) {
          this.$el.html(_.template(this.template, this.model.toJSON()));
        }
        return this;
      }
    });
  });

}).call(this);
