define(["jquery", "underscore", "backbone", "marionette"], function($, _, Backbone, Marionette) {
  var TimelineMediator;
  return TimelineMediator = (function() {
    TimelineMediator.prototype.sprite = null;

    TimelineMediator.prototype.DISPLAY_OVERLAY = "TimelineMediator.DISPLAY_OVERLAY";

    TimelineMediator.prototype.REMOVE_OVERLAY = "TimelineMediator.REMOVE_OVERLAY";

    TimelineMediator.prototype.ACTIVE = "TimelineMediator.ACTIVE";

    TimelineMediator.prototype.INACTIVE = "TimelineMediator.INACTIVE";

    function TimelineMediator(options_) {
      var _this = this;
      _.extend(this, Backbone.Events);
      this.$body = $("body");
      this.cloudSprite = options_.cloudSprite;
      this.timelineSprite = options_.timelineSprite;
      this.layout = options_.layout;
      this.data = options_.data;
      this.id = this.data.id;
      this.oid = this.data.oid;
      this.container = new PIXI.Container();
      this.graphics = new PIXI.Graphics();
      this.cloudSprite.on(this.cloudSprite.MOUSE_OVER, function() {
        return _this.onMouseOver();
      });
      this.cloudSprite.on(this.cloudSprite.MOUSE_OUT, function() {
        return _this.onMouseOut();
      });
      this.timelineSprite.on(this.timelineSprite.MOUSE_OVER, function() {
        return _this.onMouseOver();
      });
      this.timelineSprite.on(this.timelineSprite.MOUSE_OUT, function() {
        return _this.onMouseOut();
      });
      this;
    }

    TimelineMediator.prototype.checkActive = function(results_) {
      var result, toDisplay, _i, _len;
      toDisplay = false;
      for (_i = 0, _len = results_.length; _i < _len; _i++) {
        result = results_[_i];
        if (this.oid === result.oid) {
          toDisplay = true;
          break;
        }
      }
      if (toDisplay) {
        this.cloudSprite.setState(this.cloudSprite.DEFAULT);
        return this.timelineSprite.setState(this.cloudSprite.DEFAULT);
      } else {
        this.cloudSprite.setState(this.cloudSprite.INACTIVE);
        return this.timelineSprite.setState(this.cloudSprite.INACTIVE);
      }
    };

    TimelineMediator.prototype.setTimelineActive = function() {
      this.removeLine();
      this.cloudSprite.setState(this.cloudSprite.MOUSE_OUT);
      return this.timelineSprite.setState(this.cloudSprite.MOUSE_OVER);
    };

    TimelineMediator.prototype.setMouseOut = function() {
      this.removeLine();
      this.cloudSprite.setState(this.cloudSprite.MOUSE_OUT);
      return this.timelineSprite.setState(this.cloudSprite.MOUSE_OUT);
    };

    TimelineMediator.prototype.setUnselected = function() {
      this.cloudSprite.setState(this.cloudSprite.DEFAULT);
      this.timelineSprite.setState(this.timelineSprite.UNSELECTED);
      this.removeLine();
      this.layout.stage.removeChild(this.cloudSprite.getContainer());
      return this.layout.cloudSpritesContainer.addChild(this.cloudSprite.getContainer());
    };

    TimelineMediator.prototype.getContainer = function() {
      return this.container;
    };

    TimelineMediator.prototype.drawLine = function(forced_) {
      var breakLine, breakPoint, posA, posB, shadow, texture, xDif, yDif;
      if (forced_ == null) {
        forced_ = false;
      }
      this.removeLine();
      if (this.showRollover() || forced_) {
        posA = this.cloudSprite.getGlobalPosition();
        posB = this.timelineSprite.getGlobalPosition();
        xDif = posB.x - posA.x;
        yDif = posB.y - posA.y;
        breakLine = this.$body.height() - this.layout.dotsHeight - 150;
        breakPoint = breakLine - posA.y;
        this.graphics.lineStyle(3, this.timelineSprite.getColor(), 1);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(0, breakPoint);
        this.graphics.lineTo(xDif, yDif);
        texture = this.graphics.generateTexture();
        this.lineSprite = new PIXI.Sprite(texture);
        this.lineSprite.x = posA.x < posB.x ? posA.x : posA.x + xDif;
        this.lineSprite.x -= 3;
        this.lineSprite.x -= this.layout.timelineContainer.x;
        this.lineSprite.y = posA.y;
        this.lineSprite.y -= this.layout.timelineContainer.y;
        shadow = new PIXI.filters.DropShadowFilter();
        shadow.alpha = 0.25;
        shadow.angle = 0;
        shadow.blur = 11;
        shadow.distance = 0;
        shadow.color = 0x000000;
        this.lineSprite.filters = [shadow];
        this.layout.timelineContainer.addChild(this.lineSprite);
      }
      if (forced_) {
        return this.timelineSprite.setState(this.timelineSprite.MOUSE_OVER);
      }
    };

    TimelineMediator.prototype.removeLine = function() {
      this.graphics.clear();
      if (this.lineSprite) {
        this.lineSprite.filters = null;
        this.layout.timelineContainer.removeChild(this.lineSprite);
        return this.lineSprite = null;
      }
    };

    TimelineMediator.prototype.onMouseOut = function(forced_) {
      if (forced_ == null) {
        forced_ = false;
      }
      if (this.showRollover() || forced_) {
        this.cloudSprite.setState(this.cloudSprite.DEFAULT);
        this.timelineSprite.setState(this.timelineSprite.DEFAULT);
        this.removeLine();
        this.layout.stage.removeChild(this.cloudSprite.getContainer());
        this.layout.cloudSpritesContainer.addChild(this.cloudSprite.getContainer());
        return this.trigger(this.REMOVE_OVERLAY);
      }
    };

    TimelineMediator.prototype.onMouseOver = function(forced_) {
      if (forced_ == null) {
        forced_ = false;
      }
      if (this.showRollover() || forced_) {
        this.cloudSprite.setState(this.cloudSprite.MOUSE_OVER);
        this.timelineSprite.setState(this.timelineSprite.MOUSE_OVER);
        this.drawLine();
        this.layout.cloudSpritesContainer.removeChild(this.cloudSprite.getContainer());
        this.layout.stage.addChild(this.cloudSprite.getContainer());
        return this.trigger(this.DISPLAY_OVERLAY, {
          mediator: this
        });
      }
    };

    TimelineMediator.prototype.showRollover = function() {
      return !this.isOverlayUp() && this.layout.isIntroOver && !this.layout.searchResultsLayoutView;
    };

    TimelineMediator.prototype.isOverlayUp = function() {
      return this.layout.milestoneModalView !== null && this.layout.milestoneModalView !== void 0;
    };

    return TimelineMediator;

  })();
});
