var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["jquery", "underscore", "backbone", "marionette", "abstract-item-view", "pixi", "tween", "sprite-bitmap", "views/AbstractSpriteView", "math/Vector2D"], function($, _, Backbone, Marionette, AbstractItemView, pix, Tween, SpriteBitmap, AbstractSpriteView, Vector2D) {
  var CloudSpriteView;
  return CloudSpriteView = (function(_super) {
    __extends(CloudSpriteView, _super);

    CloudSpriteView.prototype.disp = null;

    CloudSpriteView.prototype.velo = null;

    CloudSpriteView.prototype.acc = null;

    CloudSpriteView.prototype.mass = 0;

    CloudSpriteView.prototype.degrees = 0;

    CloudSpriteView.prototype.degreeOffset = 1;

    CloudSpriteView.prototype.isTweening = false;

    CloudSpriteView.prototype.hasLoaded = false;

    CloudSpriteView.prototype.checkCollision = false;

    CloudSpriteView.prototype.RADIUS = 30;

    CloudSpriteView.prototype.OVER_RADIUS = 50;

    CloudSpriteView.prototype.OVER_SCALE = 1.15;

    CloudSpriteView.prototype.INIT_SCALE = 0.66;

    CloudSpriteView.prototype.ATTRACTIVE_COEFF = 1500;

    CloudSpriteView.prototype.LOADED = "CloudSpriteView.LOADED";

    function CloudSpriteView(options_) {
      var _this = this;
      if (options_ == null) {
        options_ = {};
      }
      CloudSpriteView.__super__.constructor.call(this);
      this.container.alpha = 0;
      this.$window = $(window);
      this.index = options_.index || 0;
      this.data = options_.data || {};
      this.layout = options_.layout || {};
      this.orbit = Math.random() * 20;
      this.degreeOffset = Math.random() - 0.5;
      if (this.textGraphicsContainer) {
        this.textGraphicsContainer.destroy();
      }
      if (this.data.category && this.data.category.toLowerCase() === "history") {
        this.INIT_SCALE = 0.5;
      }
      if (options_.recursive !== false) {
        this.sprite = new SpriteBitmap(this.data);
        this.sprite.on(this.sprite.LOADED, function() {
          _this.container.addChild(_this.sprite.getContainer());
          _this.container.scale = {
            x: _this.INIT_SCALE * _this.responsiveScale,
            y: _this.INIT_SCALE * _this.responsiveScale
          };
          return app.utils.delay(100, function() {
            _this.setInteractive(_this.sprite.getContainer(), true);
            _this.hasLoaded = true;
            return _this.trigger(_this.LOADED);
          });
        });
        this.sprite.startLoad();
        this.textGraphicsContainer = new PIXI.Container();
        this.textGraphics = new PIXI.Graphics();
        this.textGraphicsContainer.addChild(this.textGraphics);
        this.container.addChild(this.textGraphicsContainer);
        this.textMask = new PIXI.Graphics();
        this.container.addChild(this.textMask);
        this.textGraphicsContainer.mask = this.textMask;
      }
      this.mass = this.RADIUS;
      this.container.x = 0;
      this.container.y = 0;
      this.disp = new Vector2D(this.container.x, this.container.y);
      this.velo = new Vector2D(0, 0);
      this.acc = new Vector2D(0, 0);
      this.origVec = new Vector2D(0, 0);
      this.tempVec = new Vector2D(0, 0);
      this.width = this.RADIUS * 2;
    }

    CloudSpriteView.prototype.removeText = function() {
      if (this.textDelay) {
        clearTimeout(this.textDelay);
      }
      if (this.superTitleText) {
        this.textGraphicsContainer.removeChild(this.superTitleText);
      }
      if (this.titleText) {
        this.textGraphicsContainer.removeChild(this.titleText);
      }
      if (this.spanText) {
        return this.textGraphicsContainer.removeChild(this.spanText);
      }
    };

    CloudSpriteView.prototype.attractedTo = function(ball_) {
      var currentForceAttract, toCenter;
      if (!this.origVec) {
        return;
      }
      toCenter = this.getDispTo(ball_);
      currentForceAttract = this.getForceAttract(150, this.mass, toCenter);
      this.acc = this.getAcc(currentForceAttract);
      this.acc.multiply(0.25);
      this.velo.addVector(this.acc);
      this.disp.addVector(this.velo);
      if (Math.abs(toCenter.getVecX()) < 1 && Math.abs(toCenter.getVecY()) < 1) {
        this.acc.reset();
        return this.velo.reset();
      }
    };

    CloudSpriteView.prototype.attractedToOrig = function(ball_) {
      var currentForceAttract, toCenter;
      if (!this.origVec) {
        return;
      }
      toCenter = this.getBallVect(this);
      toCenter.minusVector(this.origVec);
      currentForceAttract = this.getForceAttract(150, this.mass, toCenter);
      this.acc = this.getAcc(currentForceAttract);
      this.acc.multiply(0.25);
      this.velo.addVector(this.acc);
      return this.disp.addVector(this.velo);
    };

    CloudSpriteView.prototype.imposeBounds = function(vecDisp_) {
      if (this.bounds) {
        vecDisp_.setVecY(Math.max(vecDisp_.getVecY(), this.bounds.minY));
        vecDisp_.setVecY(Math.min(vecDisp_.getVecY(), this.bounds.maxY));
        vecDisp_.setVecX(Math.max(vecDisp_.getVecX(), this.bounds.minX));
        vecDisp_.setVecX(Math.min(vecDisp_.getVecX(), this.bounds.maxX));
      }
      return vecDisp_;
    };

    CloudSpriteView.prototype.updateColor = function(type_, color_) {
      var update;
      update = false;
      switch (type_) {
        case "color-picker-history-cloud":
          if (this.data.category.toLowerCase() === "history") {
            if (!this.data.pivotal_moment_link) {
              update = true;
            }
          }
          break;
        case "color-picker-pivotal-cloud":
          if (this.data.category.toLowerCase() === "history") {
            if (this.data.pivotal_moment_link != null) {
              update = true;
            }
          }
          break;
        case "color-picker-eisenhower-cloud":
          if (this.data.category.toLowerCase() === "eisenhower") {
            update = true;
          }
          break;
      }
      if (update) {
        this.sprite.blendOverlay.clear();
        this.sprite.blendOverlay.beginFill(color_, 1);
        this.sprite.blendOverlay.drawRect(0, 0, 108, 108);
        return this.sprite.blendOverlay.endFill();
      }
    };

    CloudSpriteView.prototype.setState = function(state_) {
      this.removeText();
      if (this.textGraphics) {
        this.textGraphics.clear();
      }
      if (this.textMask) {
        this.textMask.clear();
      }
      switch (state_) {
        case this.MOUSE_OVER:
          this.toTop();
          this.tweenRadius(this.OVER_SCALE * this.scale * this.responsiveScale);
          this.setText();
          break;
        case this.DEFAULT:
        case this.MOUSE_OUT:
        case this.HIDDEN:
          this.toBottom();
          this.tweenRadius(this.INIT_SCALE * this.scale * this.responsiveScale);
          break;
      }
      if (this.sprite) {
        this.sprite.alpha = state_ === this.INACTIVE ? 0 : 1;
      }
      return this.state = state_;
    };

    CloudSpriteView.prototype.setText = function() {
      var _this = this;
      if (this.textDelay) {
        clearTimeout(this.textDelay);
      }
      return this.textDelay = app.utils.delay(200, function() {
        var cat, date, fill, fonts, isOnLeft, offset, padding, split, str, style, textMax, textWidth, timespandisplay, toLeft, w;
        textWidth = 422;
        padding = 12;
        offset = 2;
        fonts = app.appConfig.font;
        switch (_this.data.category.toLowerCase()) {
          case "eisenhower":
            if (_this.data.pivotal_moment_link) {
              cat = "pivotal moment";
              fill = app.appConfig.colors.pivotal_milestone_timeline;
            } else {
              cat = "eisenhower";
              fill = app.appConfig.colors.eisenhower_milestone_timeline;
            }
            break;
          case "history":
            cat = "history";
            fill = app.appConfig.colors.context_milestone_timeline;
            break;
        }
        style = {
          "font": fonts.footer,
          "fill": fill
        };
        str = app.utils.htmlDecode(cat.toUpperCase());
        _this.superTitleText = new PIXI.Text(str, style);
        _this.superTitleText.x = padding;
        _this.superTitleText.y = padding - offset;
        _this.superTitleText.cacheAsBitmap = true;
        style = {
          "font": fonts.h4,
          "fill": 0xFFFFFF,
          "wordWrap": true,
          "wordWrapWidth": textWidth
        };
        str = app.utils.htmlDecode(String(_this.data.title).toUpperCase());
        _this.titleText = new PIXI.Text(str, style);
        _this.titleText.x = padding;
        _this.titleText.y = _this.superTitleText.y + _this.superTitleText.height + 3;
        _this.titleText.cacheAsBitmap = true;
        style = {
          "font": fonts.nav,
          "fill": 0xFFFFFF,
          "wordWrap": true,
          "wordWrapWidth": textWidth
        };
        if (_this.data.timespandisplay) {
          timespandisplay = _this.data.timespandisplay;
        } else {
          split = _this.data.time_start.split("-");
          date = new Date(split[0], split[1] - 1, split[2]);
          timespandisplay = date.getFullYear();
        }
        str = app.utils.htmlDecode(String(timespandisplay).toUpperCase());
        _this.spanText = new PIXI.Text(str, style);
        _this.spanText.x = padding;
        _this.spanText.y = _this.titleText.y + _this.titleText.height;
        _this.spanText.cacheAsBitmap = true;
        _this.textGraphicsContainer.addChild(_this.superTitleText);
        _this.textGraphicsContainer.addChild(_this.titleText);
        _this.textGraphicsContainer.addChild(_this.spanText);
        textMax = Math.max(_this.superTitleText.width, _this.titleText.width);
        textWidth = Math.min(textMax, textWidth);
        if (_this.textGraphics) {
          _this.textGraphics.beginFill(app.appConfig.colors.darkGray, 0.85);
          _this.textGraphics.drawRect(0, 0, textWidth + (padding * 2), _this.spanText.y + _this.spanText.height + padding - offset);
          _this.textGraphics.endFill();
        }
        w = _this.$window.width();
        isOnLeft = (w - 500) < _this.origVec.getVecX();
        toLeft = -(_this.OVER_RADIUS + _this.textGraphicsContainer.width + 10);
        _this.textGraphicsContainer.x = isOnLeft ? toLeft : _this.OVER_RADIUS + 10;
        _this.textGraphicsContainer.y = -_this.textGraphicsContainer.height * 0.5;
        if (_this.textMask) {
          _this.textMask.beginFill(app.appConfig.colors.black);
          _this.textMask.drawRect(0, 0, textWidth + (padding * 2), _this.textGraphics.height);
          _this.textMask.endFill();
          _this.textMask.scale.x = 0;
          w = _this.textGraphicsContainer.width;
          _this.textMask.x = _this.textGraphicsContainer.x;
          if (isOnLeft) {
            _this.textMask.x += _this.textGraphicsContainer.width;
          }
          _this.textMask.y = _this.textGraphicsContainer.y;
          return _this.revealMask(isOnLeft, w);
        }
      });
    };

    CloudSpriteView.prototype.getForceAttract = function(m1, m2, vec2Center) {
      var denominator, force, forceDirection, forceMagnitude, forceX, forceY, numerator;
      numerator = m1 * m2 * this.ATTRACTIVE_COEFF;
      denominator = vec2Center.getMagnitude() * vec2Center.getMagnitude();
      if (denominator === 0) {
        force = new Vector2D(0, 0);
      } else {
        forceMagnitude = numerator / denominator;
        forceDirection = vec2Center.getAngle();
        if (forceMagnitude > 0) {
          forceMagnitude = Math.min(forceMagnitude, 2);
        }
        forceX = forceMagnitude * Math.cos(forceDirection);
        forceY = forceMagnitude * Math.sin(forceDirection);
        force = new Vector2D(forceX, forceY);
      }
      return force;
    };

    CloudSpriteView.prototype.getAcc = function(vecForce_) {
      var vecAcc;
      vecAcc = vecForce_.duplicate();
      vecAcc.multiply(1 / this.mass);
      return vecAcc;
    };

    CloudSpriteView.prototype.getDispTo = function(ball_, useTemp_) {
      var currentVector;
      if (useTemp_ == null) {
        useTemp_ = false;
      }
      currentVector = this.getBallVect(ball_, useTemp_);
      if (currentVector) {
        currentVector.minusVector(this.disp);
        currentVector.validate();
      } else {
        currentVector = new Vector2D(0, 0);
      }
      return currentVector;
    };

    CloudSpriteView.prototype.getBallVect = function(ball_, useTemp_) {
      var vect;
      if (useTemp_ == null) {
        useTemp_ = false;
      }
      if (useTemp_) {
        vect = this.tempVec.duplicate();
      } else {
        if (ball_.container) {
          vect = new Vector2D(ball_.container.x, ball_.container.y);
        } else {
          vect = new Vector2D(0, 0);
        }
      }
      vect.validate();
      return vect;
    };

    CloudSpriteView.prototype.setTempVect = function(vecDisp_) {
      this.isTemp = true;
      return this.tempVec = this.imposeBounds(vecDisp_);
    };

    CloudSpriteView.prototype.resetTempVect = function() {
      var _this = this;
      if (this.siblings) {
        this.siblings.forEach(function(current_ball) {
          var repel;
          if (current_ball !== _this) {
            if (_this.collisionInto(current_ball, true)) {
              repel = _this.repelledBy(current_ball, true);
              _this.tempVec = repel.duplicate();
              return _this.origVec = repel.duplicate();
            } else {
              return _this.origVec = _this.tempVec.duplicate();
            }
          }
        });
      }
      return this.isTemp = false;
    };

    CloudSpriteView.prototype.setDisp = function(vecDisp_) {
      return this.disp = vecDisp_.duplicate();
    };

    CloudSpriteView.prototype.setOrigVect = function(vecDisp_, recursive_) {
      var vecDisp;
      if (recursive_ == null) {
        recursive_ = true;
      }
      vecDisp = this.imposeBounds(vecDisp_.duplicate());
      this.origVec = vecDisp.duplicate();
      this.disp = vecDisp.duplicate();
      if (recursive_) {
        if (this.origVectSprite) {
          this.origVectSprite = null;
        }
        this.origVectSprite = new CloudSpriteView({
          "recursive": false
        });
        this.origVectSprite.setOrigVect(this.origVec, false);
        return this.origVectSprite.setPosition(this.origVec);
      }
    };

    CloudSpriteView.prototype.resetOrigVect = function() {
      var _this = this;
      if (this.siblings) {
        return this.siblings.forEach(function(current_ball) {
          if (_this.collisionInto(current_ball) && current_ball !== _this) {
            return _this.repelledBy(current_ball);
          }
        });
      }
    };

    CloudSpriteView.prototype.setBounds = function(bounds) {
      this.bounds = bounds;
    };

    CloudSpriteView.prototype.setSiblings = function(siblings) {
      this.siblings = siblings;
    };

    CloudSpriteView.prototype.setPosition = function(vecDisp_, initial) {
      var vecDisp;
      if (initial == null) {
        initial = false;
      }
      vecDisp = this.imposeBounds(vecDisp_);
      this.container.x = vecDisp.getVecX();
      return this.container.y = vecDisp.getVecY();
    };

    CloudSpriteView.prototype.getPosition = function() {
      var pos;
      pos = new Vector2D(this.container.x, this.container.y);
      return pos;
    };

    CloudSpriteView.prototype.getMinDist = function(ball_) {
      var minDist, padding, wA, wB;
      padding = ball_.state === this.MOUSE_OVER ? 35 : 28;
      wA = ball_.getScaledRadius();
      wB = this.getScaledRadius();
      minDist = (wA + wB) + padding;
      return minDist;
    };

    CloudSpriteView.prototype.getScaledRadius = function() {
      return this.RADIUS * this.getScale() * this.responsiveScale;
    };

    CloudSpriteView.prototype.setResponsiveScale = function(responsiveScale_) {
      if (responsiveScale_ !== this.responsiveScale) {
        this.responsiveScale = responsiveScale_;
        return this.tweenRadius(this.INIT_SCALE * this.scale * this.responsiveScale);
      }
    };

    CloudSpriteView.prototype.getRepel = function(ball_, useTemp_) {
      var directToBall, minDist, toBall;
      if (useTemp_ == null) {
        useTemp_ = false;
      }
      minDist = this.getMinDist(ball_);
      toBall = this.getDispTo(ball_, useTemp_ = false);
      directToBall = toBall.getVectorDirection();
      directToBall.multiply(minDist);
      directToBall.minusVector(toBall);
      directToBall.multiply(-1);
      return directToBall;
    };

    CloudSpriteView.prototype.collisionInto = function(ball_, useTemp_) {
      var dispToMag, minDist;
      if (useTemp_ == null) {
        useTemp_ = false;
      }
      minDist = this.getMinDist(ball_);
      dispToMag = this.getDispTo(ball_, useTemp_).getMagnitude();
      if (isNaN(dispToMag)) {
        debugger;
      }
      return dispToMag < minDist;
    };

    CloudSpriteView.prototype.repelledBy = function(ball_, useTemp_) {
      var repelDisp;
      if (useTemp_ == null) {
        useTemp_ = false;
      }
      this.velo.reset();
      repelDisp = this.getRepel(ball_, useTemp_);
      repelDisp.validate();
      return this.disp.addVector(repelDisp);
    };

    CloudSpriteView.prototype.revealMask = function(isOnLeft_, width_) {
      var obj, self, target, x;
      self = this;
      obj = {
        x: this.textMask.x,
        scale: 0
      };
      x = isOnLeft_ ? this.textMask.x - width_ : this.textMask.x;
      target = {
        x: x,
        scale: 1
      };
      return new TWEEN.Tween(obj, {
        override: true
      }).to(target, 250, TWEEN.Easing.backOut).onUpdate(function() {
        self.textMask.scale.x = obj.scale;
        return self.textMask.x = obj.x;
      }).start();
    };

    CloudSpriteView.prototype.tweenRadius = function(scale_) {
      var obj, self, target;
      self = this;
      obj = {
        scale: this.container.scale.x
      };
      target = {
        scale: scale_
      };
      return new TWEEN.Tween(obj, {
        override: true
      }).to(target, 300, TWEEN.Easing.backOut).onUpdate(function() {
        return self.container.scale = {
          x: obj.scale,
          y: obj.scale
        };
      }).start();
    };

    CloudSpriteView.prototype.fadeIn = function(x_, y_) {
      var obj, self, targetVect;
      self = this;
      obj = {
        alpha: self.container.alpha,
        scale: 0.25
      };
      targetVect = {
        alpha: 1,
        scale: this.container.scale.x
      };
      return app.utils.delay(Math.random() * 2300, function() {
        return new TWEEN.Tween(obj, {
          override: true
        }).to(targetVect, 400, TWEEN.Easing.backOut).onUpdate(function() {
          self.container.alpha = obj.alpha;
          return self.container.scale = {
            x: obj.scale,
            y: obj.scale
          };
        }).start();
      });
    };

    CloudSpriteView.prototype.tweenTo = function(targetVect_, delay_, duration_) {
      var delay, duration, obj, self,
        _this = this;
      self = this;
      this.isTweening = true;
      obj = new Vector2D(this.container.x, this.container.y);
      obj.alpha = this.container.alpha;
      targetVect_.alpha = 1;
      delay = delay_ || Math.random() * 2000;
      duration = duration_ || 500;
      if (this.tweenToDelay) {
        clearTimeout(this.tweenToDelay);
      }
      return this.tweenToDelay = app.utils.delay(delay, function() {
        return new TWEEN.Tween(obj, {
          override: true
        }).to(targetVect_, duration, TWEEN.Easing.backOut).onUpdate(function() {
          self.container.x = obj.getVecX();
          self.container.y = obj.getVecY();
          return self.container.alpha = obj.alpha;
        }).start().onComplete(function() {
          return self.isTweening = false;
        });
      });
    };

    CloudSpriteView.prototype.animate = function() {
      if (this.state === this.MOUSE_OVER || this.layout.isModalUp()) {
        return;
      }
      this.attractedTo(this.origVectSprite);
      this.checkForCollisions();
      return this.setPosition(this.disp);
    };

    CloudSpriteView.prototype.checkForCollisions = function() {
      var current_ball, hasCollided, i, length, r, _results;
      i = length = this.siblings.length;
      r = 0;
      hasCollided = false;
      _results = [];
      while (i) {
        current_ball = this.siblings[i - 1];
        if (current_ball !== this) {
          if (this.collisionInto(current_ball)) {
            this.repelledBy(current_ball);
            hasCollided = true;
          }
        }
        _results.push(i--);
      }
      return _results;
    };

    CloudSpriteView.prototype.onMouseOver = function() {
      if (!this.layout.isModalUp()) {
        return AbstractSpriteView.prototype.onMouseOver.call(this);
      }
    };

    CloudSpriteView.prototype.destroy = function() {
      return AbstractSpriteView.prototype.destory.call(this);
    };

    return CloudSpriteView;

  })(AbstractSpriteView);
});
