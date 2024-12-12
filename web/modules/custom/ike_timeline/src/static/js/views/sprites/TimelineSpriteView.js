var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["jquery", "underscore", "backbone", "marionette", "abstract-item-view", "pixi", "views/AbstractSpriteView"], function($, _, Backbone, Marionette, AbstractItemView, pix, AbstractSpriteView) {
  var TimelineSpriteView;
  return TimelineSpriteView = (function(_super) {
    __extends(TimelineSpriteView, _super);

    TimelineSpriteView.prototype.startYear = 0;

    TimelineSpriteView.prototype.endYear = 0;

    TimelineSpriteView.prototype.scale = 1;

    TimelineSpriteView.prototype.BOTTOM_MARGIN = 15;

    TimelineSpriteView.prototype.SMALL_BOTTOM_MARGIN = 10;

    TimelineSpriteView.prototype.RADIUS = 5;

    function TimelineSpriteView(options_) {
      var colors;
      TimelineSpriteView.__super__.constructor.call(this);
      this.data = options_.data || {};
      colors = app.appConfig.colors;
      switch (this.data.category.toLowerCase()) {
        case "eisenhower":
          this.color = this.data.pivotal_moment_link != null ? colors.pivotal_milestone_timeline : colors.eisenhower_milestone_timeline;
          break;
        case "history":
          this.color = colors.context_milestone_timeline;
          break;
      }
      if (this.data.time_start) {
        this.startYear = this.data.time_start.split("-")[0];
      }
      if (this.data.time_end) {
        this.endYear = this.data.time_end.split("-")[0];
      }
      this.shadow = new PIXI.filters.DropShadowFilter();
      this.shadow.alpha = 0.5;
      this.shadow.angle = 0;
      this.shadow.blur = 10;
      this.shadow.distance = 0;
      this.shadow.color = 0x000000;
      this.setInteractive(this.container);
    }

    TimelineSpriteView.prototype.setPosition = function(x, y, xInc, scale_, smallScreen_) {
      this.x = x;
      this.y = y;
      this.xInc = xInc;
      this.container.position.x = this.x;
      this.container.position.y = this.y;
      this.container.position.y -= smallScreen_ ? this.SMALL_BOTTOM_MARGIN : this.BOTTOM_MARGIN;
      if (this.scale !== scale_) {
        this.scale = scale_;
        return this.draw();
      } else if (this.getRange() !== 0) {
        return this.draw();
      }
    };

    TimelineSpriteView.prototype.updateColor = function(type_, color_) {
      switch (type_) {
        case "color-picker-history-timeline":
          if (this.data.category.toLowerCase() === "history") {
            if (!this.data.pivotal_moment_link) {
              this.color = color_;
              this.draw();
            }
          }
          break;
        case "color-picker-pivotal-timeline":
          if (this.data.category.toLowerCase() === "history") {
            if (this.data.pivotal_moment_link != null) {
              this.color = color_;
              this.draw();
            }
          }
          break;
        case "color-picker-eisenhower-timeline":
          if (this.data.category.toLowerCase() === "eisenhower") {
            this.color = color_;
            this.draw();
          }
          break;
      }
    };

    TimelineSpriteView.prototype.draw = function() {
      var diameter, radius, rectangleStrokePadding, strokeNudge, strokePadding, strokeRadius, strokeThickness, texture, w;
      if (this.responsiveScale <= 0.8) {
        strokePadding = 3;
        radius = 4;
        strokeThickness = 2;
        rectangleStrokePadding = 6;
        strokeNudge = 1;
      }
      if (this.responsiveScale > 0.8) {
        strokePadding = 4;
        radius = 5;
        strokeThickness = 3;
        rectangleStrokePadding = 7;
        strokeNudge = 1.5;
      }
      diameter = radius * 2;
      strokeRadius = radius + strokePadding;
      this.graphics.clear();
      this.graphics.lineStyle(0);
      this.graphics.beginFill(this.color);
      this.stroke.clear();
      this.stroke.lineStyle(strokeThickness, this.color);
      this.stroke.beginFill(this.color, 0);
      if (this.getRange() === 0) {
        this.graphics.drawCircle(0, 0, radius);
        this.stroke.drawCircle(0, 0, radius + strokePadding);
      } else {
        w = Math.round(this.getRange() * this.xInc + diameter);
        this.graphics.drawRoundedRect(0, 0, w, diameter, radius);
        this.stroke.drawRoundedRect(0, 0, w + rectangleStrokePadding, diameter + rectangleStrokePadding, strokeRadius);
      }
      this.graphics.endFill();
      this.stroke.endFill();
      if (this.sprite) {
        this.container.removeChild(this.sprite);
        this.sprite = null;
      }
      if (this.strokeSprite) {
        this.container.removeChild(this.strokeSprite);
        this.strokeSprite = null;
      }
      texture = this.graphics.generateTexture();
      this.sprite = new PIXI.Sprite(texture);
      this.sprite.position.x = -radius;
      this.sprite.position.y = -radius;
      this.sprite.cacheAsBitmap = true;
      texture = null;
      texture = this.stroke.generateTexture();
      this.strokeSprite = new PIXI.Sprite(texture);
      this.strokeSprite.position.x = -1 * (strokeRadius + strokeNudge);
      this.strokeSprite.position.y = -1 * (strokeRadius + strokeNudge);
      this.strokeSprite.visible = (this.state === this.MOUSE_OVER) || (this.state === this.ACTIVE);
      this.strokeSprite.cacheAsBitmap = true;
      texture = null;
      this.container.addChild(this.sprite);
      return this.container.addChild(this.strokeSprite);
    };

    TimelineSpriteView.prototype.drawMouseOver = function() {
      if (this.strokeSprite) {
        this.strokeSprite.visible = true;
      }
      this.container.filters = [this.shadow];
      this.container.alpha = 1;
      return this.toTop();
    };

    TimelineSpriteView.prototype.drawMouseOut = function() {
      if (this.strokeSprite) {
        this.strokeSprite.visible = false;
      }
      this.container.filters = null;
      this.container.alpha = this.state === this.UNSELECTED ? 0.3 : 1;
      return this.toBottom();
    };

    TimelineSpriteView.prototype.getStartYear = function() {
      return this.startYear;
    };

    TimelineSpriteView.prototype.getEndYear = function() {
      return this.endYear;
    };

    TimelineSpriteView.prototype.getRange = function() {
      if (this.endYear === 0) {
        return 0;
      } else {
        return this.endYear - this.startYear;
      }
    };

    TimelineSpriteView.prototype.getColor = function() {
      return this.color || app.appConfig.colors.mediator_line;
    };

    TimelineSpriteView.prototype.setState = function(state_) {
      this.state = state_;
      switch (this.state) {
        case this.MOUSE_OVER:
        case this.ACTIVE:
          this.drawMouseOver();
          break;
        case this.UNSELECTED:
          if (this.strokeSprite) {
            this.strokeSprite.visible = false;
          }
          this.container.alpha = 0.1;
          break;
        case this.INACTIVE:
          if (this.strokeSprite) {
            this.strokeSprite.visible = false;
          }
          this.container.alpha = 0.1;
          break;
        case this.MOUSE_OUT:
        case this.DEFAULT:
          return this.drawMouseOut();
      }
    };

    TimelineSpriteView.prototype.checkSearchOver = function(id_) {
      if (id_ === this.data.id) {
        return this.drawMouseOver();
      }
    };

    TimelineSpriteView.prototype.checkSearchOut = function(id_) {
      if (id_ === this.data.id) {
        return this.drawMouseOut();
      }
    };

    TimelineSpriteView.prototype.onMouseOver = function() {
      AbstractSpriteView.prototype.onMouseOver.call(this);
      if (this.state === this.UNSELECTED) {
        return this.drawMouseOver();
      }
    };

    TimelineSpriteView.prototype.onMouseOut = function() {
      AbstractSpriteView.prototype.onMouseOut.call(this);
      if (this.state === this.UNSELECTED) {
        return this.drawMouseOut();
      }
    };

    TimelineSpriteView.prototype.destroy = function() {
      return TimelineSpriteView.__super__.destroy.call(this);
    };

    return TimelineSpriteView;

  })(AbstractSpriteView);
});
