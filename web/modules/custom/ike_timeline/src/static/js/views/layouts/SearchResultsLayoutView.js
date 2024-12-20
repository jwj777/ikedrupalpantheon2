define(["underscore", "backbone", "abstract-layout", "tween", "views/module/SearchResultView"], function(_, Backbone, AbstractLayoutView, Tween, SearchResultView) {
  var SearchResultsLayoutView;
  return SearchResultsLayoutView = AbstractLayoutView.extend({
    shouldScroll: false,
    CLICK: "SearchResultsLayoutView.CLICK",
    MOUSE_OVER: "SearchResultsLayoutView.MOUSE_OVER",
    MOUSE_OUT: "SearchResultsLayoutView.MOUSE_OUT",
    initialize: function(options_) {
      var canvas, ctx, currentY, fonts, gradient, h, i, obj, searchResultView, str, style, texture, title, w, _i, _len, _ref,
        _this = this;
      AbstractLayoutView.prototype.initialize.call(this, options_);
      this.container = new PIXI.Container();
      this.maskedContainer = new PIXI.Container();
      this.resultsViews = [];
      this.resultsLoaded = 0;
      this.data = options_.results || {};
      this.layout = options_.layout || {};
      this.hasResults = this.data.length > 0;
      fonts = app.appConfig.font;
      if (this.hasResults) {
        fonts = app.appConfig.font;
        style = {
          "font": fonts.h3,
          "fill": 0xFFFFFF,
          "font-weight": 300
        };
        title = this.data.length + " timeline results for " + options_.query;
        str = app.utils.htmlDecode(title.toUpperCase());
        this.titleText = new PIXI.Text(str, style);
        this.titleText.x = 80;
        this.titleText.y = 40;
        this.maskedContainer.addChild(this.titleText);
        this.clearResults = this.createClear();
        this.clearResults.y = 40;
        this.maskedContainer.addChild(this.clearResults);
        this.setScroll();
        _ref = this.data;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          obj = _ref[i];
          searchResultView = new SearchResultView({
            data: obj
          });
          searchResultView.on(searchResultView.CLICK, function(data_) {
            return _this.onClick(data_);
          });
          searchResultView.on(searchResultView.LOADED, function() {
            return _this.onLoad();
          });
          searchResultView.on(searchResultView.MOUSE_OVER, function(id_) {
            return _this.trigger(_this.MOUSE_OVER, id_);
          });
          searchResultView.on(searchResultView.MOUSE_OUT, function(id_) {
            return _this.trigger(_this.MOUSE_OUT, id_);
          });
          searchResultView.startLoad();
          this.maskedContainer.addChild(searchResultView.getContainer());
          this.resultsViews.push(searchResultView);
        }
        w = this.$window.width() - 80;
        h = this.$window.height() - 120;
        canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        ctx = canvas.getContext('2d');
        gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.5, 'white');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        texture = PIXI.Texture.fromCanvas(canvas);
        this.mask = new PIXI.Sprite(texture);
        this.container.addChild(this.mask);
        this.container.addChild(this.maskedContainer);
        this.containerHeight = this.maskedContainer.height;
        this.maskedContainer.mask = this.mask;
      } else {
        currentY = (h - 170) * 0.5;
        style = {
          "font": "bold " + fonts.h1,
          "fill": 0xFFFFFF,
          'align': 'center'
        };
        title = "No timeline results for \n " + "“" + options_.query + "”";
        this.noTitleText = new PIXI.Text(title.toUpperCase(), style);
        this.noTitleText.y = currentY;
        this.container.addChild(this.noTitleText);
        style = {
          "font": fonts.body,
          "fill": 0xFFFFFF,
          'align': 'center'
        };
        title = "Check the spelling of your search term, or try something else.";
        this.checkSpellingText = new PIXI.Text(title, style);
        this.checkSpellingText.y = this.noTitleText.y + this.noTitleText.height + 50;
        this.clearResults = this.createClear();
        this.clearResults.y = this.checkSpellingText.y + this.checkSpellingText.height + 20;
        this.container.addChild(this.checkSpellingText);
        this.container.addChild(this.clearResults);
      }
      return this.onResize(this.$window.height() - 80, this.$window.width());
    },
    setScroll: function() {
      var checkBounds, dist, self, startx,
        _this = this;
      startx = 0;
      dist = 0;
      self = this;
      console.log('setScroll');
      this.container.interactive = true;
      this.container.touchstart = function(e) {
        var touchobj;
        console.log(e.data.originalEvent);
        touchobj = e.data.originalEvent.changedTouches[0];
        return startx = parseInt(touchobj.clientX);
      };
      this.container.touchmove = function(e) {
        var touchobj;
        touchobj = e.data.originalEvent.changedTouches[0];
        dist = parseInt(touchobj.clientX) - startx;
        self.maskedContainer.position.y -= dist;
        return checkBounds();
      };
      this.$window.bind('wheel mousewheel', function(e) {
        if (!_this.shouldScroll) {
          return;
        }
        if (_this.layout.isModalUp()) {
          return;
        }
        self.maskedContainer.position.y += e.originalEvent.wheelDelta * 0.1;
        return checkBounds();
      });
      return checkBounds = function() {
        var maxY, viewH;
        viewH = self.$window.height() - 60 - self.mask.height * 0.5;
        maxY = viewH - self.maskedContainer.height;
        if (maxY < 0 && self.maskedContainer.position.y < maxY) {
          self.maskedContainer.position.y = maxY;
        }
        if (self.maskedContainer.position.y > 0) {
          return self.maskedContainer.position.y = 0;
        }
      };
    },
    getContainer: function() {
      return this.container;
    },
    createClear: function() {
      var clearResults, clearText, oClearText, oSprt, oStyle, sprt, style, tween,
        _this = this;
      clearResults = new PIXI.Container();
      clearResults.interactive = true;
      sprt = new PIXI.Graphics();
      sprt.lineStyle(2, app.appConfig.colors.button_outline);
      sprt.beginFill(app.appConfig.colors.background_blue);
      sprt.drawRoundedRect(0, 0, 130, 34, 11);
      oSprt = new PIXI.Graphics();
      oSprt.lineStyle(2, app.appConfig.colors.button_outline);
      oSprt.beginFill(app.appConfig.colors.button_outline);
      oSprt.drawRoundedRect(0, 0, 130, 34, 11);
      oSprt.alpha = 0;
      style = {
        "font": "500 14px proxima-nova",
        "fill": app.appConfig.colors.button_outline
      };
      clearText = new PIXI.Text("CLEAR RESULTS", style);
      clearText.x = 13;
      clearText.y = 9;
      oStyle = {
        "font": "500 14px proxima-nova",
        "fill": app.appConfig.colors.background_blue
      };
      oClearText = new PIXI.Text("CLEAR RESULTS", oStyle);
      oClearText.x = 13;
      oClearText.y = 9;
      oClearText.alpha = 0;
      clearResults.touchstart = function() {
        app.eventBus.trigger(app.appConfig.events.SEARCH_CLEAR);
        return _this.destroy();
      };
      clearResults.mousedown = function() {
        app.eventBus.trigger(app.appConfig.events.SEARCH_CLEAR);
        return _this.destroy();
      };
      clearResults.mouseover = function() {
        tween(1);
        return _this.$body.css("cursor", "pointer");
      };
      clearResults.mouseout = function() {
        tween(0);
        return _this.$body.css("cursor", "default");
      };
      tween = function(alpha_) {
        var obj, target;
        target = {
          alpha: alpha_
        };
        obj = {
          alpha: oSprt.alpha
        };
        return new TWEEN.Tween(obj, {
          override: true
        }).to(target, 250).onUpdate(function() {
          oSprt.alpha = obj.alpha;
          return oClearText.alpha = obj.alpha;
        }).start();
      };
      clearResults.addChild(sprt);
      clearResults.addChild(clearText);
      clearResults.addChild(oSprt);
      clearResults.addChild(oClearText);
      return clearResults;
    },
    onClick: function(data_) {
      return this.trigger(this.CLICK, data_);
    },
    onLoad: function() {
      var _this = this;
      this.resultsLoaded++;
      if (this.resultsLoaded === this.data.length) {
        return app.utils.delay(10, function() {
          return _this.$window.resize();
        });
      }
    },
    onResize: function(h_, w_) {
      var i, lastY, margin, maskHeight, searchResultView, shouldScroll, smallDesktop, startX, xInc, xPos, yInc, yPos, _i, _len, _ref;
      smallDesktop = Modernizr.mq("(max-width: 1169px)");
      if (this.hasResults) {
        i = 0;
        startX = xPos = smallDesktop ? 7 : 72;
        margin = smallDesktop ? 30 : 160;
        xInc = (w_ - margin) / 3;
        yPos = 130;
        yInc = 115;
        this.titleText.x = smallDesktop ? 15 : 84;
        this.clearResults.x = w_ - this.clearResults.width - margin * 0.5;
        _ref = this.resultsViews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          searchResultView = _ref[_i];
          searchResultView.position(xPos, yPos, xInc);
          lastY = yPos;
          if (++i % 3 === 0) {
            xPos = startX;
            yPos += yInc;
          } else {
            xPos += xInc;
          }
        }
        this.scrollMax = lastY + this.mask.height * 0.5;
        shouldScroll = h_ < this.scrollMax;
        if (this.shouldScroll && !shouldScroll) {
          this.maskedContainer.position.y = 0;
        }
        this.shouldScroll = shouldScroll;
        maskHeight = this.$html.hasClass("older-ie") ? h_ * 0.66 : h_;
        this.mask.height = maskHeight;
        return this.mask.width = w_;
      } else {
        this.noTitleText.x = (w_ - this.noTitleText.width) * 0.5;
        this.checkSpellingText.x = (w_ - this.checkSpellingText.width) * 0.5;
        this.clearResults.x = (w_ - this.clearResults.width) * 0.5;
        this.noTitleText.y = (this.$window.height() - 290) * 0.5;
        this.checkSpellingText.y = this.noTitleText.y + this.noTitleText.height + 50;
        return this.clearResults.y = this.checkSpellingText.y + this.checkSpellingText.height + 20;
      }
    },
    destroy: function() {
      var searchResultView, _i, _len, _ref, _results;
      AbstractLayoutView.prototype.destroy.call(this);
      _ref = this.resultsViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        searchResultView = _ref[_i];
        _results.push(searchResultView.off());
      }
      return _results;
    }
  });
});
