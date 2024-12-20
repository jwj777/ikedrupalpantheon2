define(["jquery", "underscore", "backbone", "lp_timeline/views/LPTimelineAbstractItemView"], function($, _, Backbone, LPTimelineAbstractItemView) {
  var LPTimelineCoverFlowView;
  return LPTimelineCoverFlowView = LPTimelineAbstractItemView.extend({
    OFFSET: 100,
    ROTATION: 45,
    BASE_ZINDEX: 10,
    MAX_ZINDEX: 42,
    initialize: function(args_) {
      var _self;
      _self = this;
      this.index = 0;
      this.thumbs = [];
      this.transformName = Modernizr.prefixed('transform');
      this.thumbs = this.$el.find(".chapter-thumb");
      this.thumbs.click(function() {
        var $this, id;
        $this = $(this);
        if ($this.hasClass("active")) {
          id = $this.data().anchorid;
          return app.eventBus.trigger("CHAPTER_CLICK", id);
        } else {
          _self.index = _self.thumbs.index($this);
          return _self.render();
        }
      });
      return this.render();
    },
    render: function() {
      var $thumb, i, scale, thumb, transY, _results;
      i = 0;
      _results = [];
      while (i < this.thumbs.length) {
        scale = 1 - (Math.abs(this.index - i) * 0.25);
        scale = Math.max(scale, 0.25);
        thumb = this.thumbs[i];
        $thumb = $(thumb);
        transY = this.OFFSET * (i - this.index) + 50;
        if (i < this.index) {
          $thumb.removeClass("active").css({
            "z-index": this.BASE_ZINDEX + i
          });
        }
        if (i > this.index) {
          $thumb.removeClass("active").css({
            "z-index": this.BASE_ZINDEX + this.thumbs.length - i
          });
        }
        if (i === this.index) {
          $thumb.addClass("active").css({
            "z-index": this.MAX_ZINDEX
          });
          thumb.style[this.transformName] = 'translateY( 50% )  scale3d( 1, 1, 1 )';
        } else {
          thumb.style[this.transformName] = "translateY( " + transY + "% )  scale3d( " + scale + ", " + scale + ", " + scale + " )";
        }
        _results.push(i++);
      }
      return _results;
    }
  });
});
