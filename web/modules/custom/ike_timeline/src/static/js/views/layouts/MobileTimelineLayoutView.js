define([
  "underscore",
  "backbone",
  "masonry",
  "imagesloaded",
  "lazy",
  "abstract-layout",
  "mobile-milestone-layout-view",
  "mobile-search-results-layout-view"
],
function(
  _,
  Backbone,
  Masonry,
  imagesLoaded,
  lazy,
  AbstractLayoutView,
  MobileMilestoneLayoutView,
  MobileSearchResultsLayoutView
  ) {
  var MobileTimelineLayoutView;
  return MobileTimelineLayoutView = AbstractLayoutView.extend({
    regions: {
      timeline: "#timeline"
    },
    events: {
      "click .grid-item": "showCurrentMilestone",
      "click .accordion-list": "accordionOpenClose"
    },
    currentMilestone: "",
    currentMasonryIndex: 0,
    domEras: [],
    eras: [],
    heights: [],
    msnryEras: [],
    initialize: function(options_) {
      this.$container = $('#container');
      this.$window = $(window);
      this.$timeline = $("#timeline");
      this.$accordion = $(".accordion");
      if (options_.showMilestone) {
        this.viewSelect = true;
        this.viewSelectId = $("#view-select").data("id");
      } else {
        this.viewSelect = false;
      }
      this.getData();
      return AbstractLayoutView.prototype.initialize.call(this);
    },
    getData: function() {
      var $jsonA,
        _this = this;
      $jsonA = $.getJSON(window.base_url + "/modules/custom/ike_timeline/src/static/api/milestones.json");
      console.log('jsona',$jsonA);
      return $.when($jsonA).done(function(resA_) {
        _this.data = resA_.data.sort(function(a, b) {
          var aEnd, aInt, bEnd, bInt;
          aInt = a.time_start.split("-")[0];
          bInt = b.time_start.split("-")[0];
          aEnd = a.time_end ? a.time_end.split("-")[0] : 0;
          bEnd = b.time_end ? b.time_end.split("-")[0] : 0;
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
        });
        if (_this.viewSelect) {
          _this.displayMilestone(_this.viewSelectId);
        }
        _this.init();
        return _this.fetchEras();
      }).fail(function(message) {
        return console.log('Error message', message);
      });
    },
    fetchEras: function(startIndex) {
      var self, url;
      if (startIndex == null) {
        startIndex = 0;
      }
      self = this;
      url = window.base_url + "/modules/custom/ike_timeline/src/static/api/eras.json";
      return $.get(url, function(result) {
        console.log('result', result);
        var era, index, _i, _len, _ref, _results;
        self.eras = result.data;
        self.eras.sort(function(a, b) {
          return a.time_end - b.time_end;
        });
        _ref = self.eras;
        _results = [];
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          era = _ref[index];
          if (index > startIndex) {
            _results.push(self.fetchMilestonesFromEra(era));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    },
    fetchMilestonesFromEra: function(era) {
      var self, url,
        _this = this;
      self = this;
      url = window.base_url + "/modules/custom/ike_timeline/src/static/api/by-era/" + era.id;
      console.log('117:', url);
      return $.ajax({
        url: url,
        async: true,
        dataType: "html",
        success: function(data) {
          var elem_;
          elem_ = $.parseHTML(data);
          return self.init(elem_, era);
        }
      });
    },
    runMasonry: function(elem_) {
      var msnry, submSelector;
      submSelector = elem_.find(".submenu");
      msnry = new Masonry(submSelector[0], {
        itemSelector: ".grid-item",
        percentPosition: true,
        gutter: ".grid-sizer"
      });
      return submSelector.addClass('visible');
    },
    init: function(elem_, era_) {
      var date, dateEl, dateRange, el, end, gridItems, index, msnry, period, selectedElem, self, sm, years;
      self = this;
      if (elem_) {
        selectedElem = elem_[1];
        el = $(selectedElem).find('.submenu');
        dateEl = $(selectedElem).find('.time-period-dates');
        dateRange = era_.time_start + " - " + era_.time_end;
        dateEl.html(dateRange);
        this.subm = el;
      } else {
        this.subm = $(".accordion-list").find(".submenu");
        date = $(".accordion-list").find(".time-period-dates").html();
        if (date) {
          years = date.split("-");
        }
        if (years) {
          period = years[years.length - 1];
        }
        if (period) {
          this.domEras.push(parseInt(period.trim("")));
        }
      }
      sm = this.subm[0];
      $(sm).removeClass("is-collapsed");
      gridItems = $(sm).find('.grid-item');
      msnry = new Masonry(sm, {
        itemSelector: ".grid-item",
        percentPosition: true,
        gutter: ".grid-sizer"
      });
      this.msnryEras.push(msnry);
      if (elem_) {
        end = parseInt(era_.time_end);
        this.domEras.push(end);
        this.domEras.sort(function(a, b) {
          return a - b;
        });
        index = this.domEras.indexOf(end);
        this.insertElemAtIndex(index, elem_);
      }
      msnry.on('layoutComplete', function() {
        var ht_, index_, loadingScreen;
        loadingScreen = $(".loading-screen.timeline");
        if ($(loadingScreen).hasClass('active')) {
          self.$timeline.addClass("active");
          $(".accordion-list").addClass('active');
          $(loadingScreen).remove();
        }
        gridItems.removeClass('not-loaded');
        ht_ = $(sm).height();
        if (era_) {
          index_ = self.eras.map(function(val) {
            return val.id;
          }).indexOf(era_.id);
          self.setHeight(ht_, index_);
        } else {
          self.setHeight(ht_, 0);
        }
        self.setElemsHeight(sm);
        return $(sm).parent().addClass("loaded");
      });
      return msnry.layout();
    },
    insertElemAtIndex: function(index_, elem_) {
      var numOfChildren;
      numOfChildren = $(".accordion").children().size();
      if (index_ > numOfChildren) {
        $(".accordion").append(elem_);
        return;
      }
      return $(".accordion > li:nth-child(" + index_ + ")").after(elem_);
    },
    setElemsHeight: function(sm) {
      var ht, hts;
      if (!$(sm).parent().hasClass('active')) {
        $(sm).css('height', '0px');
        return $(sm).addClass('is-collapsed');
      } else {
        hts = this.getHeight();
        ht = hts[this.currentMasonryIndex];
        $(sm).css('height', ht + 'px');
        return $(sm).removeClass('is-collapsed');
      }
    },
    setHeight: function(ht_, index_) {
      if (index_ === 0 || index_ > 0) {
        this.heights[index_] = ht_;
        return;
      }
      return this.heights.push(ht_);
    },
    getHeight: function() {
      return this.heights;
    },
    getDataForTimePeriod: function(timePeriod_, index_) {
      var filteredData,
        _this = this;
      filteredData = this.data.filter(function(val, index) {
        var categoryYearEnd, categoryYearStart, sourceYear;
        sourceYear = new Date(val.time_start).getUTCFullYear();
        categoryYearStart = new Date(timePeriod_.time_start).getUTCFullYear();
        categoryYearEnd = new Date(timePeriod_.time_end).getUTCFullYear();
        if (index_ === 0) {
          return sourceYear < categoryYearEnd;
        } else if (index_ === (_this.timelineData.length - 1)) {
          return sourceYear >= categoryYearStart;
        }
        return sourceYear >= categoryYearStart && sourceYear < categoryYearEnd;
      });
      return filteredData;
    },
    accordionOpenClose: function(e) {
      var aet, allEventTags, collapsingList, h_, hts, i, scrollPos, self, _i, _len,
        _this = this;
      self = this;
      if ($(e.target).parent().hasClass('accordion-list')) {
        collapsingList = $(e.target).parent().find('.submenu');
      } else if ($(e.target).parent().parent().hasClass('accordion-list')) {
        collapsingList = $(e.target).parent().parent().find('.submenu');
      } else if ($(e).hasClass('accordion-list')) {
        collapsingList = $(e).find('.submenu');
      }
      if (!collapsingList) {
        return;
      }
      if (!collapsingList.parent().hasClass('loaded')) {
        return;
      }
      allEventTags = $(".accordion-list");
      for (i = _i = 0, _len = allEventTags.length; _i < _len; i = ++_i) {
        aet = allEventTags[i];
        if (!$(aet).hasClass('loaded')) {
          continue;
        }
        if ($(aet).find('.submenu')[0] === collapsingList[0]) {
          if (collapsingList.hasClass('is-collapsed')) {
            hts = self.getHeight();
            h_ = hts[i];
            this.currentMasonryIndex = i;
            collapsingList.css('height', h_);
            collapsingList.removeClass('is-collapsed');
            $(aet).addClass('active');
            scrollPos = this.getScrollPos(i, true);
            app.utils.delay(200, function() {
              return $("body, html, document").animate({
                scrollTop: scrollPos + 'px'
              }, {
                'duration': 400,
                'easing': 'linear'
              });
            });
          } else {
            collapsingList.css('height', 0);
            collapsingList.addClass('is-collapsed');
            $(aet).removeClass('active');
          }
        } else {
          $(aet).find('.submenu').addClass('is-collapsed');
          $(aet).find('.submenu').css('height', 0);
          $(aet).removeClass('active');
        }
      }
      return e.preventDefault();
    },
    getCurrent: function(id_) {
      return this.data.map(function(val) {
        return val.oid;
      }).indexOf(id_);
    },
    showCurrentMilestone: function(event) {
      var id_;
      console.log('311', $(event.currentTarget));
      id_ = $(event.currentTarget).data("id");
      return this.displayMilestone(id_);
    },
    displayMilestone: function(id_, sd) {
      var currentTargetId, options_, slideDirection,
        _this = this;
      currentTargetId = id_;
      this.currentIndex = this.getCurrent(currentTargetId);
      this.currentMilestone = this.data[this.currentIndex];
      console.log('thisData', this.data);
      console.log('currentIndex', this.currentIndex);
      console.log('currentTargetId', currentTargetId);
      console.log('currentMilestone', this.currentMilestone);
      this.currentId = this.currentMilestone.id;
      this.milestoneURL = window.base_url + "/timeline/milestone/" + this.currentId + '/mobile';
      console.log('332', this.milestoneURL);
      slideDirection = sd || "fade";
      $(".loading-screen").addClass('active');
      if (this.milestoneView) {
        this.destroyCurrentMilestone();
      }
      options_ = {
        "data": this.data,
        "currentMilestone": this.currentMilestone,
        "currentIndex": this.currentIndex,
        "slideDirection": slideDirection
      };
      this.milestoneView = new MobileMilestoneLayoutView({
        el: this.timeline.el,
        options_: options_
      });
      this.milestoneView.on(this.milestoneView.PREPARE, function() {
        return _this.addingModal();
      });
      this.milestoneView.on(this.milestoneView.NEXT, function() {
        return _this.nextMilestone();
      });
      this.milestoneView.on(this.milestoneView.PREV, function() {
        return _this.prevMilestone();
      });
      return this.milestoneView.on(this.milestoneView.DESTROY, function() {
        return _this.destroyMilestone();
      });
    },
    getScrollPos: function(index_, spacing_) {
      if (spacing_ == null) {
        spacing_ = false;
      }
      if (spacing_) {
        return (60 * index_) + (10 * index_);
      }
      if (index_ === 0) {
        return 60;
      }
      return (60 * index_) + (10 * index_);
    },
    addingModal: function() {
      var scrollDist, self;
      self = this;
      history.replaceState({
        "id": this.currentId
      }, "milestone", this.milestoneURL);
      if ($("#timeline").hasClass('overflow')) {
        return;
      }
      scrollDist = $('#timeline').offset().top - $(window).scrollTop();
      self.bodyScroll = scrollDist;
      $("#timeline").removeClass('active');
      $("#timeline").addClass('overflow');
      return $("#header").fadeOut("fast");
    },
    nextMilestone: function() {
      var length, nextId, nextIndex, slideDirection;
      length = this.data.length;
      nextIndex = this.currentIndex === length - 1 ? 0 : this.currentIndex + 1;
      nextId = this.data[nextIndex].oid;
      slideDirection = "left";
      return this.displayMilestone(nextId, slideDirection);
    },
    prevMilestone: function() {
      var length, nextIndex, prevId, slideDirection;
      length = this.data.length;
      nextIndex = this.currentIndex === 0 ? length - 1 : this.currentIndex - 1;
      prevId = this.data[nextIndex].oid;
      slideDirection = "right";
      return this.displayMilestone(prevId, slideDirection);
    },
    destroyCurrentMilestone: function() {
      this.milestoneView.off();
      return this.milestoneView = null;
    },
    destroyMilestone: function() {
      var scrollPos;
      this.milestoneView.off();
      this.milestoneView = null;
      scrollPos = this.getScrollPos(this.currentMasonryIndex);
      $("#timeline").addClass('active');
      $("#timeline").removeClass('overflow');
      $("#header").fadeIn("fast");
      if (this.bodyScroll) {
        window.scrollTo(0, Math.abs(this.bodyScroll));
      }
      history.pushState({
        "id": this.currentId
      }, "timeline", "/");
      if (this.viewSelect) {
        return this.viewSelect = false;
      }
    },
    getMilestoneFromId: function(id_) {
      var f;
      f = this.data.filter(function(val) {
        return val.oid === id_;
      });
      return f[0];
    },
    getMilestonesFromSearch: function(results_) {
      var self;
      self = this;
      return results_.map(function(val) {
        return self.getMilestoneFromId(val.oid);
      });
    },
    queryAutocomplete: function(results_, query_) {},
    displayResults: function(results_, query_) {
      var resultsType, searchMilestones, self,
        _this = this;
      self = this;
      resultsType = 'string';
      searchMilestones = '';
      app.eventBus.on(app.appConfig.events.SEARCH_CLEAR, function() {
        return _this.clearResults();
      });
      this.clearResults();
      if (Array.isArray(results_)) {
        searchMilestones = this.getMilestonesFromSearch(results_);
        resultsType = 'array';
      } else if (results_ === '404') {
        resultsType = 'error';
      } else {
        searchMilestones = results_;
      }
      $('.accordion-list').not(".search").addClass("overflow");
      this.$accordion.removeClass('fade');
      this.searchResultsLayoutView = new MobileSearchResultsLayoutView({
        results: searchMilestones,
        query: query_,
        type: resultsType
      });
      return this.searchResultsLayoutView.on(this.searchResultsLayoutView.LOADED, function(elem_) {
        return self.runMasonry(elem_);
      });
    },
    clearResults: function() {
      $('.accordion-list').not(".search").removeClass("overflow");
      if (this.searchResultsLayoutView) {
        this.searchResultsLayoutView.clear();
        this.searchResultsLayoutView.off();
        return this.searchResultsLayoutView = null;
      }
    },
    onResize: function(height_, width_) {
      return this.currentHeight = height_;
    }
  });
});
