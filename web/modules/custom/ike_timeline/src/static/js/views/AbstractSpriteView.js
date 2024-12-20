define(["jquery", "underscore", "backbone", "marionette", "pixi"], function($, _, Backbone, Marionette, pix) {
  var AbstractSpriteView;
  return AbstractSpriteView = (function() {
    AbstractSpriteView.prototype.container = null;

    AbstractSpriteView.prototype.graphics = null;

    AbstractSpriteView.prototype.stroke = null;

    AbstractSpriteView.prototype.sprite = null;

    AbstractSpriteView.prototype.isOver = false;

    AbstractSpriteView.prototype.scale = 1;

    AbstractSpriteView.prototype.responsiveScale = 1;

    AbstractSpriteView.prototype.CLICK = "AbstractSpriteView.CLICK";

    AbstractSpriteView.prototype.ACTIVE = "AbstractSpriteView.ACTIVE";

    AbstractSpriteView.prototype.INACTIVE = "AbstractSpriteView.INACTIVE";

    AbstractSpriteView.prototype.HIDDEN = "AbstractSpriteView.HIDDEN";

    AbstractSpriteView.prototype.DEFAULT = "AbstractSpriteView.DEFAULT";

    AbstractSpriteView.prototype.UNSELECTED = "AbstractSpriteView.UNSELECTED";

    AbstractSpriteView.prototype.MOUSE_OVER = "AbstractSpriteView.MOUSE_OVER";

    AbstractSpriteView.prototype.MOUSE_OUT = "AbstractSpriteView.MOUSE_OUT";

    function AbstractSpriteView(options_) {
      this.container = new PIXI.Container();
      this.graphics = new PIXI.Graphics();
      this.stroke = new PIXI.Graphics();
      this.$body = $("body");
      this.setState(this.DEFAULT);
      this.container.zIndex = 0;
      _.extend(this, Backbone.Events);
    }

    AbstractSpriteView.prototype.setInteractive = function(interactiveElement, setBouds_) {
      var bounds,
        _this = this;
      this.interactiveElement = interactiveElement;
      if (setBouds_ == null) {
        setBouds_ = false;
      }
      if (setBouds_) {
        bounds = this.interactiveElement.getBounds();
        bounds.x = -bounds.width * 0.5;
        bounds.y = -bounds.height * 0.5;
        this.interactiveElement.hitArea = bounds;
      }
      this.interactiveElement.interactive = true;
      this.interactiveElement.buttonMode = true;
      this.interactiveElement.touchstart = function() {
        return _this.onMouseOver();
      };
      this.interactiveElement.mouseover = function() {
        return _this.onMouseOver();
      };
      this.interactiveElement.mouseout = function() {
        return _this.onMouseOut();
      };
      return this.interactiveElement.mousedown = function() {
        return _this.onMouseClick();
      };
    };

    AbstractSpriteView.prototype.fadeBack = function() {};

    AbstractSpriteView.prototype.toTop = function() {
      return this.container.zIndex = 100;
    };

    AbstractSpriteView.prototype.toBottom = function() {
      return this.container.zIndex = 0;
    };

    AbstractSpriteView.prototype.getContainer = function() {
      return this.container;
    };

    AbstractSpriteView.prototype.getData = function() {
      return this.data;
    };

    AbstractSpriteView.prototype.getGlobalPosition = function() {
      var tx, ty;
      tx = this.container.parent.x + this.container.x;
      ty = this.container.parent.y + this.container.y;
      return {
        x: tx,
        y: ty
      };
    };

    AbstractSpriteView.prototype.getOriginalPosition = function() {
      return {
        x: this.origX,
        y: this.origY
      };
    };

    AbstractSpriteView.prototype.getPosition = function() {
      return this.container.position;
    };

    AbstractSpriteView.prototype.getScale = function() {
      return this.container.scale.x;
    };

    AbstractSpriteView.prototype.setPosition = function(x, y, xInc) {
      this.x = x;
      this.y = y;
      this.xInc = xInc;
    };

    AbstractSpriteView.prototype.setActive = function(active) {
      this.active = active;
    };

    AbstractSpriteView.prototype.setState = function(state) {
      this.state = state;
    };

    AbstractSpriteView.prototype.setResponsiveScale = function(responsiveScale) {
      this.responsiveScale = responsiveScale;
    };

    AbstractSpriteView.prototype.onMouseClick = function() {
      this.isOver = false;
      return this.trigger(this.CLICK);
    };

    AbstractSpriteView.prototype.onMouseOver = function() {
      if ((this.state === this.MOUSE_OVER) && this.$body.hasClass("ipad")) {
        return this.onMouseClick();
      } else {
        this.isOver = true;
        return this.trigger(this.MOUSE_OVER);
      }
    };

    AbstractSpriteView.prototype.onMouseOut = function() {
      this.isOver = false;
      return this.trigger(this.MOUSE_OUT);
    };

    AbstractSpriteView.prototype.destroy = function() {};

    return AbstractSpriteView;

  })();
});
