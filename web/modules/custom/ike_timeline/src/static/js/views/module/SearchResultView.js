define(["jquery", "underscore", "backbone", "views/AbstractSpriteView", "sprite-bitmap"], function($, _, Backbone, AbstractSpriteView, SpriteBitmap) {
  var SearchResultView;
  return SearchResultView = (function() {
    SearchResultView.prototype.RADIUS = 45;

    SearchResultView.prototype.CLICK = "SearchResultView.CLICK";

    SearchResultView.prototype.LOADED = "SearchResultView.LOADED";

    SearchResultView.prototype.MOUSE_OVER = "SearchResultView.MOUSE_OVER";

    SearchResultView.prototype.MOUSE_OUT = "SearchResultView.MOUSE_OUT";

    SearchResultView.prototype.hasLoaded = false;

    function SearchResultView(options_) {
      _.extend(this, Backbone.Events);
      this.$body = $("body");
      this.data = options_.data || {};
      this.container = new PIXI.Container();
    }

    SearchResultView.prototype.startLoad = function() {
      var _this = this;
      this.sprite = new SpriteBitmap(this.data);
      this.sprite.on(this.sprite.LOADED, function() {
        return _this.onLoad();
      });
      return this.sprite.startLoad();
    };

    SearchResultView.prototype.onLoad = function() {
      var container,
        _this = this;
      this.hasLoaded = true;
      container = this.sprite.getContainer();
      container.x = 54;
      container.y = 54;
      this.container.addChild(container);
      this.container.interactive = true;
      this.container.mousedown = function() {
        return _this.onClick();
      };
      this.container.touchstart = function() {
        console.log('touch');
        return _this.onClick();
      };
      this.container.mouseover = function() {
        _this.trigger(_this.MOUSE_OVER, _this.data.id);
        return _this.$body.css("cursor", "pointer");
      };
      this.container.mouseout = function() {
        _this.trigger(_this.MOUSE_OUT, _this.data.id);
        return _this.$body.css("cursor", "default");
      };
      return this.trigger(this.LOADED);
    };

    SearchResultView.prototype.position = function(x_, y_, xInc_) {
      var fonts, str, style, textLeft, textStart;
      this.container.x = x_;
      this.container.y = y_;
      if (this.titleText) {
        this.container.removeChild(this.titleText);
      }
      if (this.dateText) {
        this.container.removeChild(this.dateText);
      }
      textStart = 25;
      textLeft = this.RADIUS * 2 + 20;
      fonts = app.appConfig.font;
      style = {
        "font": fonts.links_active,
        "fill": 0xFFFFFF,
        "font-weight": "bold",
        "wordWrap": true,
        "wordWrapWidth": xInc_ - textLeft - 30
      };
      str = app.utils.htmlDecode(String(this.data.title).toUpperCase());
      this.titleText = new PIXI.Text(str, style);
      this.titleText.x = textLeft;
      this.titleText.y = textStart;
      style = {
        "font": fonts.dates,
        "fill": 0xFFFFFF
      };
      str = app.utils.htmlDecode(String(this.data.timespan_display).toUpperCase());
      this.dateText = new PIXI.Text(str, style);
      this.dateText.x = textLeft;
      this.dateText.y = textStart + this.titleText.height + 8;
      this.container.addChild(this.titleText);
      return this.container.addChild(this.dateText);
    };

    SearchResultView.prototype.getContainer = function() {
      return this.container;
    };

    SearchResultView.prototype.onClick = function() {
      console.log('onClick');
      return this.trigger(this.CLICK, this.data);
    };

    return SearchResultView;

  })();
});
