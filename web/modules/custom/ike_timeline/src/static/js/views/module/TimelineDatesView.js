define(["underscore", "backbone", "views/sprites/TimelineSpriteView", "abstract-view"], function(_, Backbone, TimelineSpriteView, AbstractView) {
  var TimelineDatesView;
  return TimelineDatesView = AbstractView.extend({
    container: null,
    graphics: null,
    MARGIN: 35,
    DATE_Y: 40,
    ERA_TITLE_Y: 6,
    LINE_HEIGHT: 35,
    initialize: function(data, startYear, endYear) {
      this.data = data;
      this.startYear = startYear;
      this.endYear = endYear;
      AbstractView.prototype.initialize.call(this, this.data);
      this.container = new PIXI.Container();
      return this.yearRange = this.endYear - this.startYear;
    },
    addLegend: function(w_) {
      var cx, cy, style;
      cx = 0;
      cy = this.DATE_Y + (w_ < 1070 ? 18 : 25);
      console.log('w_', w_, 'cy', cy);
      style = {
        font: "500 12px proxima-nova-condensed",
        fill: "#FFFFFF"
      };
      this.ikeSpriteView = new TimelineSpriteView({
        data: {
          category: "eisenhower"
        }
      });
      this.ikeSpriteView.setPosition(cx, cy + 22, 1, 15, false);
      this.container.addChild(this.ikeSpriteView.getContainer());
      cx += this.ikeSpriteView.container.width;
      this.timeTextA = new PIXI.Text("Eisenhower's Life".toUpperCase(), style);
      this.timeTextA.x = cx;
      this.timeTextA.y = cy;
      this.container.addChild(this.timeTextA);
      cx += this.timeTextA.width + 15;
      this.pivotalSpriteView = new TimelineSpriteView({
        data: {
          category: "eisenhower",
          pivotal_moment_link: "true"
        }
      });
      this.pivotalSpriteView.setPosition(cx, cy + 22, 1, 15, false);
      this.container.addChild(this.pivotalSpriteView.getContainer());
      cx += this.pivotalSpriteView.container.width;
      this.timeTextB = new PIXI.Text("Pivotal Moments".toUpperCase(), style);
      this.timeTextB.x = cx;
      this.timeTextB.y = cy;
      this.container.addChild(this.timeTextB);
      cx += this.timeTextB.width + 15;
      this.historySpriteView = new TimelineSpriteView({
        data: {
          category: "history"
        }
      });
      this.historySpriteView.setPosition(cx, cy + 22, 1, 15, false);
      this.container.addChild(this.historySpriteView.getContainer());
      cx += this.historySpriteView.container.width;
      this.timeTextC = new PIXI.Text("Historical Events".toUpperCase(), style);
      this.timeTextC.x = cx;
      this.timeTextC.y = cy;
      return this.container.addChild(this.timeTextC);
    },
    addText: function(text_, isTitle_, w_) {
      var style, timeText;
      style = {
        font: "500 15px proxima-nova-condensed",
        fill: "#FFFFFF"
      };
      if (isTitle_) {
        if (w_ < 1220 && w_ > 1000) {
          style.font = "500 12px proxima-nova-condensed";
        }
        if (w_ <= 1000 && w_ > 800) {
          style.font = "500 10px proxima-nova-condensed";
        }
        if (w_ <= 800) {
          style.font = "500 9px proxima-nova-condensed";
        }
      }
      timeText = new PIXI.Text(text_, style);
      this.container.addChild(timeText);
      return timeText;
    },
    drawLine: function(xPos_) {
      this.graphics.beginFill(0xFF3300);
      this.graphics.lineStyle(1, 0xFFFFFF, 1);
      this.graphics.moveTo(xPos_, 0);
      this.graphics.lineTo(xPos_, this.LINE_HEIGHT);
      return this.graphics.endFill();
    },
    getContainer: function() {
      return this.container;
    },
    onResize: function(h_, w_) {
      var date, dateW, end, i, length, start, text, textW, xPos, _i, _len, _ref;
      length = this.container.children.length;
      while (length--) {
        this.container.removeChild(this.container.children[length]);
      }
      if (this.graphics) {
        this.graphics = null;
      }
      this.graphics = new PIXI.Graphics();
      this.graphics.beginFill(app.appConfig.colors.era_back);
      this.graphics.drawRect(0, 0, w_, this.LINE_HEIGHT - 5);
      this.graphics.endFill();
      this.container.addChild(this.graphics);
      this.yearInc = w_ / this.yearRange;
      length = this.data.length;
      _ref = this.data;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        date = _ref[i];
        start = date.time_start;
        end = date.time_end;
        xPos = (start - this.startYear) * this.yearInc;
        dateW = (end - start) * this.yearInc;
        text = this.addText(date.title.toUpperCase(), true, w_);
        textW = text.width;
        text.x = xPos + (dateW * 0.5) - textW * 0.5;
        text.y = this.ERA_TITLE_Y;
        if (w_ < 1220 && w_ > 1000) {
          text.y += 1;
        }
        if (w_ <= 1000 && w_ > 800) {
          text.y += 2;
        }
        if (w_ <= 800) {
          text.y += 3;
        }
        date = this.addText(start, false, w_);
        dateW = date.width;
        date.x = xPos - dateW * 0.5;
        date.y = this.DATE_Y;
        this.drawLine(xPos);
        if (i === (length - 1)) {
          xPos = w_;
          text = this.addText(end);
          dateW = text.width;
          text.x = xPos - dateW * 0.5;
          text.y = this.DATE_Y;
          this.drawLine(xPos);
        }
      }
      return this.addLegend(w_);
    }
  });
});
