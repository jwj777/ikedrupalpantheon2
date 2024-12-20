define(["underscore", "backbone", "abstract-view"], function(_, Backbone, AbstractView) {
  var AbstractModalView;
  return AbstractModalView = AbstractView.extend({
    parent: 'body',
    className: 'overlay-modal',
    initialize: function(options_) {
      this.options = options_;
      AbstractView.prototype.initialize.call(this, options_);
      return $('.overlay-modal').remove();
    },
    events: {
      "click .close-x": "fadeOut"
    },
    onTemplateLoad: function() {
      delay(10, function() {
        return $('.scaled-fade').removeClass('scaled-fade');
      });
      return AbstractView.prototype.onTemplateLoad.call(this);
    },
    checkOverlay: function() {
      var h, scrollTop;
      scrollTop = $(window).scrollTop() + 25;
      h = $("#container").height();
      $(".overlay-modal").height(h);
      return $(".modal-form").css("margin-top", scrollTop);
    },
    overlayClick: function() {
      var $overlayModal,
        _this = this;
      $overlayModal = $(this.parent).find('.overlay-modal');
      return $overlayModal.click(function(e) {
        if (e.target === $overlayModal.get(0)) {
          window.location.hash = "";
          return _this.fadeOut();
        }
      });
    },
    fadeOut: function() {
      var _this = this;
      return this.$el.fadeOut(500, function() {
        _this.undelegateEvents();
        return _this.$el.remove();
      });
    }
  });
});
