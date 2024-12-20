define(["underscore", "backbone", "abstract-nav-view"], function(_, Backbone, AbstractNavView) {
  var HeaderNavView;
  return HeaderNavView = AbstractNavView.extend({
    CHANGE: "HeaderNavView.CHANGE",
    CLEAR: "HeaderNavView.CLEAR",
    initialize: function() {
      var _this = this;
      AbstractNavView.prototype.initialize.call(this);
      this.$inputWrapper = $(".top-nav-search-wrapper");
      app.eventBus.on(app.appConfig.events.SEARCH_CLEAR, function() {
        return _this.clear();
      });
      this.$close = this.$inputWrapper.find(".close-icon-small");
      this.$close.click(function() {
        return app.eventBus.trigger(app.appConfig.events.SEARCH_CLEAR);
      }).hide();
      this.$search = $("#search");
      return this.$search.focus(function() {
        _this.$inputWrapper.addClass("active");
        return _this.$close.show();
      }).blur(function() {
        if (_this.$search.val().length === 0) {
          return _this.clear(false);
        }
      }).keyup(function(e) {
        if (_this.$search.val().length < 2) {
          return;
        }
        return _this.search(_this.$search.val(), e.which !== 13);
      });
    },
    clear: function(blur_) {
      if (blur_ == null) {
        blur_ = true;
      }
      this.$search.val("");
      if (blur_) {
        this.$search.blur();
      }
      this.$inputWrapper.removeClass("active");
      return this.$close.hide();
    }
  });
});
