define(["jquery", "backbone", "pixi"], function($, Backbone, pix) {
  var SpriteBitmap;
  return SpriteBitmap = (function() {
    var hasLoaded;

    hasLoaded = false;

    SpriteBitmap.prototype.RADIUS = 47;

    SpriteBitmap.prototype.SPRITES_LOADED = 0;

    SpriteBitmap.prototype.LOADED = "SpriteBitmap.LOADED";

    function SpriteBitmap(data, reposition) {
      var colors;
      this.data = data;
      this.reposition = reposition != null ? reposition : true;
      _.extend(this, Backbone.Events);
      this.$html = $("html");
      this.container = new PIXI.Container();
      if (!this.data.category) {
        this.data.category = "history";
      }
      colors = app.appConfig.colors;
      switch (this.data.category.toLowerCase()) {
        case "eisenhower":
          this.tint = this.data.pivotal_moment_link != null ? colors.pivotal_moments_tint : colors.eisenhower_milestone_tint;
          break;
        case "history":
          this.tint = colors.context_milestone_tint;
          break;
      }
      this.colorMatrix = new PIXI.filters.ColorMatrixFilter();
      this.colorMatrix.desaturate();
      this.blendOverlay = new PIXI.Graphics();
      this.blendOverlay.beginFill(this.tint, 1);
      this.blendOverlay.blendMode = PIXI.BLEND_MODES.SCREEN;
      this.blendOverlay.drawRect(0, 0, 108, 108);
      this.blendOverlay.endFill();
    }

    SpriteBitmap.prototype.startLoad = function() {
      var url,
        _this = this;
      if (this.$html.hasClass("older-ie" || !app.isWebGL)) {
        this.mask = new PIXI.Graphics();
        this.mask.beginFill(0xFFFFFF, 1);
        this.mask.drawCircle(this.RADIUS, this.RADIUS, this.RADIUS);
        this.mask.endFill();
        this.mask.x = 7;
        this.mask.y = 7;
        this.onLoad();
      } else {
        this.mask = PIXI.Sprite.fromImage(window.base_url + "/modules/custom/ike_timeline/src/static/img/mask.png");
        if (this.mask.texture.baseTexture.hasLoaded) {
          this.onLoad();
        } else {
          this.mask.texture.baseTexture.on("loaded", function() {
            return _this.onLoad();
          });
          this.mask.texture.baseTexture.on("error", function() {
            return _this.onLoad();
          });
        }
      }
      this.shadow = PIXI.Sprite.fromImage(window.base_url + "/modules/custom/ike_timeline/src/static/img/dropshadows.png");
      if (this.shadow.texture.baseTexture.hasLoaded) {
        this.onLoad();
      } else {
        this.shadow.texture.baseTexture.on("loaded", function() {
          return _this.onLoad();
        });
        this.shadow.texture.baseTexture.on("error", function() {
          return _this.onLoad();
        });
      }
      if ((this.data.thumbnail_image != null) && (this.data.thumbnail_image !== "None")) {
        url = this.data.thumbnail_image;
      } else {
        if (this.data.media_type === "audio" || this.data.media_type === "audio_and_image") {
          url = window.base_url + "/static/img/png/icon-audio-eisenhower.png";
        } else {
          url = window.base_url + "/static/img/missing.png";
        }
      }
      this.sprite = PIXI.Sprite.fromImage(url);
      if (this.sprite.texture.baseTexture.hasLoaded) {
        return this.onLoad();
      } else {
        this.sprite.texture.baseTexture.on("loaded", function() {
          return _this.onLoad();
        });
        return this.sprite.texture.baseTexture.on("error", function() {
          return _this.onLoad();
        });
      }
    };

    SpriteBitmap.prototype.onLoad = function() {
      if (++this.SPRITES_LOADED === 3) {
        this.hasLoaded = true;
        this.sprite.x = (108 - this.sprite.width) * 0.5;
        this.sprite.y = (108 - this.sprite.height) * 0.5;
        this.sprite.filters = [this.colorMatrix];
        this.spriteContainer = new PIXI.Container();
        this.spriteContainer.addChild(this.sprite);
        if (!this.$html.hasClass("older-ie")) {
          this.spriteContainer.addChild(this.blendOverlay);
        }
        this.spriteContainer.addChild(this.mask);
        this.spriteContainer.mask = this.mask;
        this.container.addChild(this.shadow);
        this.container.addChild(this.spriteContainer);
        this.spriteContainer.x = -54;
        this.spriteContainer.y = -54;
        this.shadow.x = -54;
        this.shadow.y = -54;
        if (!this.$html.hasClass("older-ie") && !window.debug) {
          this.spriteContainer.cacheAsBitmap = true;
        }
        return this.trigger(this.LOADED);
      }
    };

    SpriteBitmap.prototype.getContainer = function() {
      return this.container;
    };

    SpriteBitmap.prototype.destroy = function() {
      return SpriteBitmap.__super__.destroy.call(this);
    };

    return SpriteBitmap;

  })();
});
