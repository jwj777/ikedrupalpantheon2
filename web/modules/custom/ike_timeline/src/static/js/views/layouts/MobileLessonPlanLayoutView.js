define(["underscore", "backbone", "abstract-layout"], function(_, Backbone, AbstractLayoutView) {
  var MobileLessonPlanLayoutView;
  return MobileLessonPlanLayoutView = AbstractLayoutView.extend({
    currentSelected: "all",
    filters: [],
    lessonFilters: {},
    events: {
      "click .lesson-plan-filter-title": "dropDown",
      "click .lesson-plan-filter-wrapper": "filterSelection"
    },
    initialize: function() {
      this.$lessonPlans = $('.lesson-plans');
      this.$lessonPlanFilterWrapper = this.$lessonPlans.find('.lesson-plan-filter-wrapper');
      this.$lessonPlanFilterTitle = $('.lesson-plan-filter-title');
      this.$lessonPlansWrapper = $('.lesson-plans-wrapper');
      this.$lessonPlansText = $('.lesson-plan-text');
      this.$filterTxt = this.$lessonPlanFilterWrapper.find('.filter-txt');
      this.allLessonFilters = $('.tag-txt');
      this.filterTags();
      return this.getFilters();
    },
    filterTags: function() {
      var self;
      self = this;
      return $.each(this.allLessonFilters, function(index, value) {
        var f_, filters_, fl, fltrs, _i, _len, _results;
        filters_ = $(value).data('filter');
        fltrs = filters_.split(',');
        _results = [];
        for (_i = 0, _len = fltrs.length; _i < _len; _i++) {
          fl = fltrs[_i];
          f_ = fl.toLowerCase();
          _results.push(self.lessonFilters[f_] = fl);
        }
        return _results;
      });
    },
    filterSelection: function(event) {
      var selected, selectedText, self;
      self = this;
      selected = $(event.target).data('filter').toLowerCase();
      selectedText = $(event.target).html();
      this.$lessonPlanFilterTitle.find('.filter-txt').html(selectedText);
      this.dropDown();
      _.each(this.$filterTxt, function(filter) {
        var currentFilter;
        currentFilter = $(filter).data('filter').toLowerCase();
        if (currentFilter === selected) {
          $(filter).addClass('hide');
          return self.currentSelected = selected;
        } else {
          return $(filter).removeClass('hide');
        }
      });
      return this.filterLesson();
    },
    filterLesson: function() {
      var self;
      self = this;
      this.$lessonPlansText.removeClass('hide');
      if (this.currentSelected === 'all') {
        return;
      }
      return this.filterLessons();
    },
    filterLessons: function() {
      var self;
      self = this;
      return _.each(this.$lessonPlansText, function(lp) {
        var cs, tags;
        tags = $(lp).data('tags').split(' ');
        _.each(tags, function(tg, innerindex) {
          return tags[innerindex] = tg.trim();
        });
        cs = self.lessonFilters[self.currentSelected];
        if (!(tags.indexOf(cs) > -1)) {
          return $(lp).addClass('hide');
        }
      });
    },
    dropDown: function(event) {
      this.$lessonPlanFilterWrapper.slideToggle('fast');
      $(".openarrow-icon").toggleClass("hide");
      $(".collapsearrow-icon").toggleClass("hide");
      return this.$lessonPlansWrapper.toggleClass('fade');
    },
    getFilters: function() {
      var self;
      self = this;
      return _.each(this.$filterTxt, function(filter) {
        return self.filters.push($(filter).data('filter'));
      });
    },
    displayResults: function(query_) {
      console.log("query_ from lesson", query_);
      console.log(window.base_url);
    }
  });
});
