define([
  "underscore",
  "backbone",
  "abstract-layout",
  "pixi",
  "views/sprites/CloudSpriteView",
  "views/sprites/TimelineSpriteView",
  "views/module/TimelineDatesView",
  "views/modal/MilestoneModalView",
  "search-results-layout-view",
  "mediator/TimelineMediator",
  "math/Vector2D",
  "spectrum",
  "tinycolor"],
  function(_, Backbone, AbstractLayoutView, pix, CloudSpriteView, TimelineSpriteView, TimelineDatesView, MilestoneModalView, SearchResultsLayoutView, TimelineMediator, Vector2D, spectrum, tinycolor) {
  var TimelineLayoutView;
  return TimelineLayoutView = AbstractLayoutView.extend({
    camera: null,
    stage: null,
    renderer: null,
    isIntroOver: false,
    haveSpritesLoaded: false,
    baseURL: "",
    particlesTotal: 200,
    startYear: 1889,
    endYear: 1969,
    height: 0,
    width: 0,
    timelineHeight: 375,
    dotsHeight: 0,
    current: 0,
    mouseX: 0,
    mouseY: 0,
    spritesLoaded: 0,
    positions: [],
    objects: [],
    cloudSpriteViews: [],
    timelineSpriteViews: [],
    timelineMediators: [],
    MARGIN: 35,
    WIN_HEIGHT: 1440,
    WIN_WIDTH: 3000,
    initialize: function(options) {
      var _this = this;
      this.options = options;
      AbstractLayoutView.prototype.initialize.call(this, this.options);
      this.$navTop = $(".top-nav");
      this.$container = $("#container");
      this.$bottomNav = $(".bottom-nav");
      this.setStage();
      this.getData();
      if (this.options.showMilestone) {
        this.fromDeeplink();
      }
      return $(document).bind('keydown', function(e) {
        return _this.onKeyDown(e);
      });
    },
    setStage: function() {
      var config, h, w;
      this.stage = new PIXI.Container();
      this.navTop = this.$navTop.height();
      this.navH = this.navTop + this.$bottomNav.height();
      w = this.$window.width();
      h = this.$window.height() - this.navH;
      config = this.$html.hasClass("firefox") || this.$html.hasClass("ipad") ? {} : {
        antialias: true
      };
      this.renderer = PIXI.autoDetectRenderer(w, h, config);
      this.renderer.autoResize = true;
      this.renderer.backgroundColor = app.appConfig.colors.background_blue;
      if(PIXI.CanvasRenderer) {
        app.isWebGL = !(this.renderer instanceof PIXI.CanvasRenderer);
      } else {
        app.isWebGL = true;
      }
      this.cloudSpritesContainer = new PIXI.Container();
      this.timelineContainer = new PIXI.Container();
      this.searchResultsContainer = new PIXI.Container();
      this.$container.prepend(this.renderer.view);
      this.renderer.resize(w, h);
      this.initPreloader(w, h);
      this.animate();
      return this.initDebug();
    },
    getData: function() {
      var $jsonA, $jsonB,
        _this = this;
      if (window.debug) {
        $jsonA = $.getJSON(window.base_url + "/static/mock_data/mock.json");
        $jsonB = $.getJSON(window.base_url + "/static/mock_data/mock-date.json");
      } else {
        $jsonA = $.getJSON(window.base_url + "/modules/custom/ike_timeline/src/static/api/milestones.json");
        $jsonB = $.getJSON(window.base_url + "/modules/custom/ike_timeline/src/static/api/eras.json");
      }
      return $.when($jsonA, $jsonB).done(function(resA_, resB_) {
        var convertQuotes;
        _this.data = resA_[0].data.sort(function(a, b) {
          var aEnd, aInt, bEnd, bInt, e;
          if (!a.time_start) {
            alert(a.title + " MILESTONE NEEDS A TIME START");
          }
          try {
            aInt = a.time_start.replace(/-/g, '');
            bInt = b.time_start.replace(/-/g, '');
            aEnd = a.time_end ? a.time_end.replace(/-/g, '') : 0;
            bEnd = b.time_end ? b.time_end.replace(/-/g, '') : 0;
            if (aInt > bInt) {
              return 1;
            } else if (aInt < bInt) {
              return -1;
            } else {
              if (aEnd < bEnd) {
                return 1;
              } else if (aEnd > bEnd) {
                return -1;
              } else {
                return 0;
              }
            }
          } catch (_error) {
            e = _error;
            return 0;
          }
        });
        convertQuotes = function(obj_) {
          var k;
          for (k in obj_) {
            if (typeof obj_[k] === 'object' && obj_[k] !== null) {
              convertQuotes(obj_[k]);
            } else if (typeof obj_[k] === 'string' && !['thumbnail_image', 'fullscreen_image'].includes(k)) {
              obj_[k] = app.utils.smarten(obj_[k]);
            }
          }
          return obj_;
        };
        _this.data = convertQuotes(_this.data);
        _this.timelineData = resB_[0].data.sort(function(a, b) {
          if (a.time_start > b.time_start) {
            return 1;
          } else {
            return -1;
          }
        });
        _this.populateStage();
        if (_this.options.showMilestone) {
          return _this.setMilestoneIndex(_this.mileStoneID);
        }
      }).fail(function(message) {
        return console.log('Error message', message);
      });
    },
    fromDeeplink: function() {
      var $el, data;
      $el = $(".milestone");
      this.mileStoneID = $el.data("id");
      data = {
        el: $el,
        id: this.mileStoneID,
        media_type: $el.data("mediatype"),
        category: $el.data("category"),
        downloaduri: $el.data("downloaduri"),
        fullscreen_image: $el.data("fullscreenimage"),
        pivotal_moment_link: $el.data("pivotalmomentlink")
      };
      return this.initMilestone(data);
    },
    initPreloader: function(w_, h_) {
      var fonts, int, style,
        _this = this;
      fonts = app.appConfig.font;
      style = {
        "font": "bold " + fonts.h1,
        "fill": 0xFFFFFF,
        "font-weight": 900
      };
      this.loadingTitleText = new PIXI.Text("LOADING", style);
      this.loadingTitleText.x = w_ * 0.5 - this.loadingTitleText.width * 0.5;
      this.loadingTitleText.y = h_ * 0.5 - this.loadingTitleText.height * 0.5;
      this.stage.addChild(this.loadingTitleText);
      int = 0;
      return this.loadingInterval = setInterval(function() {
        switch (++int) {
          case 1:
            return _this.loadingTitleText.text = "LOADING.";
          case 2:
            return _this.loadingTitleText.text = "LOADING..";
          case 3:
            return _this.loadingTitleText.text = "LOADING...";
          case 4:
            _this.loadingTitleText.text = "LOADING";
            return int = 0;
        }
      }, 500);
    },
    sponsorShip: function() {
      var $sponsor, delay,
        _this = this;
      $sponsor = $(".bottom-sponsor");
      $sponsor.addClass("active");
      delay = $sponsor.data("duration") || 3000;
      return app.utils.delay(delay, function() {
        return $sponsor.removeClass("active");
      });
    },
    populateStage: function() {
      var cloudSpriteView, data, h, i, self, timeHeight, timelineMediator, timelineSpriteView, w,
        _this = this;
      self = this;
      w = this.$window.width();
      h = this.$window.height();
      this.particlesTotal = this.data.length;
      timeHeight = this.dotsHeight > 0 ? this.dotsHeight + 175 : this.timelineHeight;
      this.maxCloudH = Math.max(350, h - this.navH - timeHeight);
      this.timelineDatesView = new TimelineDatesView(this.timelineData, this.startYear, this.endYear);
      this.timelineContainer.addChild(this.timelineDatesView.getContainer());
      i = 0;
      while (i < this.particlesTotal) {
        data = this.data[i];
        cloudSpriteView = new CloudSpriteView({
          index: i,
          total: this.particlesTotal,
          data: data,
          layout: this
        });
        timelineSpriteView = new TimelineSpriteView({
          index: i,
          data: data
        });
        timelineMediator = new TimelineMediator({
          cloudSprite: cloudSpriteView,
          timelineSprite: timelineSpriteView,
          data: data,
          layout: this
        });
        timelineMediator.on(timelineMediator.DISPLAY_OVERLAY, function(arg) {
          return _this.displayRollover(arg);
        });
        cloudSpriteView.on(cloudSpriteView.CLICK, function() {
          return self.displayMilestoneModal(this.data, false);
        });
        cloudSpriteView.on(cloudSpriteView.LOADED, function() {
          return _this.onSpriteLoad();
        });
        timelineSpriteView.on(timelineSpriteView.CLICK, function() {
          return self.displayMilestoneModal(this.data, false);
        });
        this.cloudSpritesContainer.addChild(cloudSpriteView.getContainer());
        this.timelineContainer.addChild(timelineSpriteView.getContainer());
        this.stage.addChild(timelineMediator.getContainer());
        this.cloudSpriteViews.push(cloudSpriteView);
        this.timelineSpriteViews.push(timelineSpriteView);
        this.timelineMediators.push(timelineMediator);
        i++;
      }
      this.cloudSpriteViews.forEach(function(el) {
        return el.setSiblings(_this.cloudSpriteViews);
      });
      return this.$container.mousemove(function(e) {
        _this.mouseX = e.pageX;
        return _this.mouseY = e.pageY - _this.navTop;
      });
    },
    initDebug: function() {},
    allDefault: function() {
      if (!this.isModalUp()) {
        this.cloudSpriteViews.forEach(function(el) {
          return el.setState(el.DEFAULT);
        });
        return this.timelineSpriteViews.forEach(function(el) {
          return el.setState(el.DEFAULT);
        });
      }
    },
    displayRollover: function(arg_) {
      var timelineMediator, _i, _len, _ref;
      if (!this.isModalUp()) {
        _ref = this.timelineMediators;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          timelineMediator = _ref[_i];
          if (timelineMediator !== arg_.mediator) {
            timelineMediator.setMouseOut();
          }
        }
      }
      return this.updateStageOrder();
    },
    displayMilestoneModal: function(data_, fadePrevious_) {
      var data, url,
        _this = this;
      if (data_ == null) {
        data_ = {};
      }
      if (fadePrevious_ == null) {
        fadePrevious_ = true;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      data = this.$body.hasClass("ipad") && this.$body.hasClass("is-desktop") ? {
        "request_desktop": 1
      } : {};
      url = window.base_url + "/timeline/milestone/" + data_.id + "/";
      history.pushState({
        "id": data_.id
      }, "milestone", url);
      if (this.$ajax) {
        this.$ajax.abort();
      }
      return this.$ajax = $.ajax({
        url: url,
        data: data,
        dataType: "html",
        context: self,
        success: function(milestoneTemplate) {
          var mt;
          _this.isLoading = false;
          mt = $(milestoneTemplate);
          data_.el = mt;
          if (fadePrevious_) {
            mt.hide().fadeIn("fast");
          }
          _this.$container.append(mt);
          _this.initMilestone(data_, fadePrevious_);
          _this.setMilestoneIndex(data_);
          _this.updateStageOrder();
          return _this.$window.resize();
        }
      });
    },
    setMilestoneIndex: function(data_) {
      var data, id, length, nextIndex, nextTitle, prevIndex, prevTitle, showNext, showPrev, timelineMediator, _i, _j, _len, _len1, _ref, _ref1, _results;
      if (typeof data_ === 'object') {
        this.currentIndex = this.data.indexOf(data_);
      } else {
        _ref = this.data;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          data = _ref[_i];
          if (data.id === data_) {
            this.currentIndex = this.data.indexOf(data);
            break;
          }
        }
      }
      id = this.data[this.currentIndex].id;
      length = this.data.length;
      if (this.currentIndex === length - 1) {
        nextIndex = 0;
        showNext = false;
      } else {
        nextIndex = this.currentIndex + 1;
        showNext = true;
      }
      if (this.currentIndex === 0) {
        prevIndex = length - 1;
        showPrev = false;
      } else {
        prevIndex = this.currentIndex - 1;
        showPrev = true;
      }
      nextTitle = this.data[nextIndex].title;
      prevTitle = this.data[prevIndex].title;
      if (this.milestoneModalView) {
        this.milestoneModalView.setTitles(prevTitle, nextTitle, showPrev, showNext);
      }
      _ref1 = this.timelineMediators;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        timelineMediator = _ref1[_j];
        if (id === timelineMediator.data.id) {
          _results.push(timelineMediator.setTimelineActive());
        } else {
          _results.push(timelineMediator.setUnselected(true));
        }
      }
      return _results;
    },
    initMilestone: function(data_, fadePrevious_) {
      var _this = this;
      if (data_ == null) {
        data_ = {};
      }
      if (fadePrevious_ == null) {
        fadePrevious_ = true;
      }
      if (this.milestoneModalView && !this.milestoneModalView.isDestroyed) {
        this.milestoneModalView.destroy(fadePrevious_);
      }
      this.milestoneModalView = new MilestoneModalView(data_);
      this.milestoneModalView.on(this.milestoneModalView.DESTROY, function(e) {
        return _this.onModalDestroy(e);
      });
      this.milestoneModalView.on(this.milestoneModalView.NEXT, function() {
        return _this.onNext();
      });
      return this.milestoneModalView.on(this.milestoneModalView.PREV, function() {
        return _this.onPrev();
      });
    },
    isModalUp: function() {
      return this.milestoneModalView !== null && this.milestoneModalView !== void 0;
    },
    animate: function() {
      var _this = this;
      requestAnimationFrame(function() {
        return _this.animate();
      });
      if (this.isIntroOver) {
        this.cloudSpriteViews.forEach(function(cloudSpriteViews) {
          return cloudSpriteViews.animate();
        });
      }
      this.renderer.render(this.stage);
      return TWEEN.update();
    },
    updateStageOrder: function() {
      this.cloudSpritesContainer.children.sort(function(a, b) {
        a = a.zIndex || 0;
        b = b.zIndex || 0;
        return a - b;
      });
      return this.timelineContainer.children.sort(function(a, b) {
        a = a.zIndex || 0;
        b = b.zIndex || 0;
        return a - b;
      });
    },
    updateColor: function(type_, color_) {
      var _this = this;
      this.cloudSpriteViews.forEach(function(sprite, i) {
        return sprite.updateColor(type_, color_);
      });
      return this.timelineSpriteViews.forEach(function(sprite, i) {
        return sprite.updateColor(type_, color_);
      });
    },
    queryAutocomplete: function(autoCompleteResults) {
      var mediator, _i, _len, _ref, _results;
      this.autoCompleteResults = autoCompleteResults;
      _ref = this.timelineMediators;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mediator = _ref[_i];
        _results.push(mediator.checkActive(this.autoCompleteResults));
      }
      return _results;
    },
    displayResults: function(results_, query_) {
      var cloudSpriteView, objs, result, results, _i, _j, _k, _len, _len1, _len2, _ref, _ref1,
        _this = this;
      _ref = this.cloudSpriteViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cloudSpriteView = _ref[_i];
        this.cloudSpritesContainer.addChild(cloudSpriteView.getContainer());
      }
      this.cloudSpritesContainer.visible = false;
      results = [];
      if (results_.length) {
        this.queryAutocomplete(results_);
        _ref1 = this.data;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          objs = _ref1[_j];
          for (_k = 0, _len2 = results_.length; _k < _len2; _k++) {
            result = results_[_k];
            if (result.oid === objs.oid) {
              results.push(objs);
            }
          }
        }
      }
      this.timelineContainer.visible = results_.length > 0;
      this.removeSearchResults();
      app.eventBus.on(app.appConfig.events.SEARCH_CLEAR, function() {
        return _this.clearResults();
      });
      this.searchResultsLayoutView = new SearchResultsLayoutView({
        results: results,
        query: query_,
        layout: this
      });
      this.searchResultsLayoutView.on(this.searchResultsLayoutView.CLICK, function(data_) {
        return _this.displayMilestoneModal(data_);
      });
      this.searchResultsLayoutView.on(this.searchResultsLayoutView.MOUSE_OVER, function(id_) {
        if (!_this.isModalUp()) {
          return _this.timelineSpriteViews.forEach(function(sprite, i) {
            return sprite.checkSearchOver(id_);
          });
        }
      });
      this.searchResultsLayoutView.on(this.searchResultsLayoutView.MOUSE_OUT, function(id_) {
        if (!_this.isModalUp()) {
          return _this.timelineSpriteViews.forEach(function(sprite, i) {
            return sprite.checkSearchOut(id_);
          });
        }
      });
      return this.searchResultsContainer.addChild(this.searchResultsLayoutView.getContainer());
    },
    clearResults: function() {
      this.cloudSpritesContainer.visible = true;
      this.timelineContainer.visible = true;
      this.removeSearchResults();
      return this.allDefault();
    },
    removeSearchResults: function() {
      if (this.searchResultsLayoutView) {
        this.searchResultsContainer.removeChild(this.searchResultsLayoutView.getContainer());
        this.searchResultsLayoutView.off();
        return this.searchResultsLayoutView = null;
      }
    },
    isOccupied: function(x, y) {
      var e;
      try {
        if (this.yearColumns[x][y] === 1) {
          return true;
        } else {
          return false;
        }
      } catch (_error) {
        e = _error;
        return console.log(e);
      }
    },
    setOccupied: function(x, y) {
      var e, val;
      try {
        val = this.yearColumns[x][y];
        return this.yearColumns[x][y] = val != null ? val + 1 : 1;
      } catch (_error) {
        e = _error;
        return console.log(e);
      }
    },
    isOccupiedInRange: function(x, y, range) {
      var i, _i, _ref;
      for (i = _i = x, _ref = x + range; x <= _ref ? _i < _ref : _i > _ref; i = x <= _ref ? ++_i : --_i) {
        if (this.isOccupied(i, y)) {
          return true;
        }
      }
      return false;
    },
    setOccupiedRange: function(x, y, range) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = x, _ref = x + range + 1; x <= _ref ? _i < _ref : _i > _ref; i = x <= _ref ? ++_i : --_i) {
        _results.push(this.setOccupied(i, y));
      }
      return _results;
    },
    onSpriteLoad: function() {
      var _this = this;
      this.spritesLoaded++;
      if (this.cloudSpriteViews.length === this.spritesLoaded) {
        this.haveSpritesLoaded = true;
        app.utils.delay(4000, function() {
          return _this.isIntroOver = true;
        });
        app.utils.delay(5000, function() {
          return _this.sponsorShip();
        });
        app.utils.delay(2000, function() {
          return _this.cloudSpriteViews.forEach(function(cloudSpriteView) {
            return cloudSpriteView.checkCollision = true;
          });
        });
        app.utils.delay(1000, function() {
          return _this.cloudSpriteViews.forEach(function(cloudSpriteView) {
            return cloudSpriteView.fadeIn(_this.midX, _this.midY);
          });
        });
        clearInterval(this.loadingInterval);
        this.stage.removeChild(this.loadingTitleText);
        this.stage.addChild(this.cloudSpritesContainer);
        this.stage.addChild(this.timelineContainer);
        this.stage.addChild(this.searchResultsContainer);
        return this.onResize();
      }
    },
    onModalDestroy: function(fadeToTimeline_) {
      var url, version;
      if (fadeToTimeline_ == null) {
        fadeToTimeline_ = false;
      }
      this.milestoneModalView = null;
      if (fadeToTimeline_) {
        version = this.$body.hasClass("ipad") && this.$body.hasClass("is-desktop") ? "desktop" : "";
        url = window.base_url === "" ? "/" : window.base_url;
        if (version === "desktop" && (url.lastIndexOf('request_desktop') === -1)) {
          url += "?request_desktop=1&";
        }
        history.pushState({
          "id": 0
        }, "milestone", url);
        if (this.searchResultsLayoutView) {
          return this.queryAutocomplete(this.autoCompleteResults);
        } else {
          return this.allDefault();
        }
      }
    },
    onNext: function() {
      var length, newIndex;
      length = this.data.length;
      newIndex = this.currentIndex === length - 1 ? 0 : this.currentIndex + 1;
      return this.displayMilestoneModal(this.data[newIndex], false);
    },
    onPrev: function() {
      var length, newIndex;
      length = this.data.length;
      newIndex = this.currentIndex === 0 ? length - 1 : this.currentIndex - 1;
      return this.displayMilestoneModal(this.data[newIndex], false);
    },
    onKeyDown: function(e) {
      if (this.milestoneModalView && !this.milestoneModalView.isFullscreen) {
        switch (e.which) {
          case 37:
            return this.onPrev();
          case 39:
            return this.onNext();
        }
      }
    },
    onResize: function(h_, w_) {
      var bounds, cloudXInc, cloudYInc, dHeight, h, hasResized, historyInc, historyX, historyY, i, ikeInc, ikeX, ikeY, maxY, minY, padding, scale, self, smallScreen, spriteMargin, timeHeight, timeWidth, total, w, xInc, xOffset, yInc,
        _this = this;
      self = this;
      hasResized = (this.height !== h_) || (this.width !== w_);
      this.height = h_;
      this.width = w_;
      this.navTop = this.$navTop.height();
      this.navH = this.navTop + this.$bottomNav.height();
      smallScreen = w_ <= 1169;
      this.MARGIN = smallScreen ? 20 : 35;
      w = Math.max(this.$window.width(), app.appConfig.sizing.min_desktop_width);
      h = Math.max(this.$window.height(), app.appConfig.sizing.min_desktop_height) - this.navH;
      scale = Math.min(1, h / this.WIN_HEIGHT);
      scale = Math.min(scale, w / this.WIN_WIDTH);
      scale = Math.max(0.265, scale);
      timeWidth = w - this.MARGIN * 2;
      timeHeight = this.dotsHeight > 0 ? this.dotsHeight + 175 : this.timelineHeight;
      this.maxCloudH = Math.max(330, h - timeHeight);
      this.midX = timeWidth * 0.5 + this.MARGIN;
      this.midY = this.maxCloudH * 0.5;
      if (this.timelineDatesView) {
        this.timelineDatesView.onResize(h, timeWidth);
      }
      if (this.milestoneModalView) {
        this.milestoneModalView.onResize(this.maxCloudH, w);
      }
      if (this.searchResultsLayoutView) {
        this.searchResultsLayoutView.onResize(h, w);
      }
      if (this.$preload) {
        this.$preload.width(w);
        this.$preload.height(this.maxCloudH);
      }
      if (this.loadingTitleText) {
        this.loadingTitleText.x = w * 0.5 - this.loadingTitleText.width * 0.5;
        this.loadingTitleText.y = h * 0.5 - this.loadingTitleText.height * 0.5;
      }
      this.timelineContainer.x = this.MARGIN;
      this.timelineContainer.y = smallScreen ? h - 75 : h - 90;
      total = i = this.endYear - this.startYear;
      cloudXInc = timeWidth / 21;
      cloudYInc = this.maxCloudH / 4;
      if (this.haveSpritesLoaded && hasResized) {
        i += 1;
        this.yearColumns = [];
        while (i--) {
          this.yearColumns.push([0]);
        }
        total = this.yearColumns.length;
        xInc = timeWidth / total;
        yInc = Math.min(18 * scale, 15);
        dHeight = 0;
        xOffset = 10;
        this.timelineSpriteViews.forEach(function(sprite) {
          var fits, range, startIndex, verticalIndex, xPos, yPos;
          sprite.setResponsiveScale(scale);
          verticalIndex = 0;
          range = sprite.getRange();
          startIndex = sprite.getStartYear() - self.startYear;
          fits = false;
          if (range) {
            while (!fits) {
              if (_this.isOccupiedInRange(startIndex, verticalIndex, range) === true) {
                verticalIndex++;
              } else {
                _this.setOccupiedRange(startIndex, verticalIndex, range);
                xPos = startIndex * xInc + xOffset;
                yPos = -verticalIndex * yInc;
                sprite.setPosition(xPos, yPos, xInc, scale, smallScreen);
                fits = true;
              }
            }
          } else {
            while (!fits) {
              if (_this.isOccupied(startIndex, verticalIndex) === true) {
                verticalIndex++;
              } else {
                _this.setOccupied(startIndex, verticalIndex);
                xPos = startIndex * xInc + xOffset;
                yPos = -verticalIndex * yInc;
                sprite.setPosition(xPos, yPos, xInc, scale, smallScreen);
                fits = true;
              }
            }
          }
          return dHeight = Math.min(dHeight, -verticalIndex * yInc);
        });
        this.dotsHeight = (dHeight - 50) * -1;
        padding = 30;
        spriteMargin = 50;
        minY = smallScreen ? 30 : 50;
        maxY = smallScreen ? this.maxCloudH + 30 : this.maxCloudH;
        bounds = {
          minX: spriteMargin,
          minY: minY,
          maxX: w - spriteMargin,
          maxY: maxY
        };
        historyX = 0;
        historyY = 0;
        historyInc = 0;
        ikeX = 0;
        ikeY = 0;
        ikeInc = 0;
        this.cloudSpriteViews.forEach(function(cloudSpriteView) {
          var data, isHistory, startX, startY, vector, x, y;
          data = cloudSpriteView.data;
          isHistory = data.category.toLowerCase() === "history";
          if (isHistory) {
            startX = historyX;
            startY = historyY;
            historyInc++;
            if (historyInc === 1) {
              startY = -1.25;
            }
            if (historyInc === 2) {
              startY = 1.25;
            }
            if (historyInc === 3) {
              startY = -1.5;
            }
            if (historyInc === 4) {
              startY = 1.5;
              historyX++;
              historyInc = 0;
            }
          } else {
            startX = ikeX;
            startY = ikeY;
            ikeInc++;
            if (ikeInc === 1) {
              ikeY = 0.25;
            }
            if (ikeInc === 2) {
              ikeY = -0.25;
            }
            if (ikeInc === 3) {
              ikeY = 0.75;
            }
            if (ikeInc === 4) {
              ikeY = -0.75;
              ikeX++;
              ikeInc = 0;
            }
          }
          x = startX * cloudXInc + padding;
          x += app.utils.getRandomInRange(-cloudXInc * 0.5, cloudXInc * 0.5);
          y = startY * cloudYInc + _this.midY + 75;
          y += app.utils.getRandomInRange(0, 25);
          if ((ikeX % 1 === 0) || (historyX % 1 === 0)) {
            y -= 50;
          }
          vector = new Vector2D(x, y);
          cloudSpriteView.setBounds(bounds);
          cloudSpriteView.setResponsiveScale(scale);
          cloudSpriteView.setOrigVect(vector);
          return cloudSpriteView.animate();
        });
      }
      return this.renderer.resize(w, h);
    }
  });
});
