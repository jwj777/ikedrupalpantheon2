define(["underscore", "backbone", "abstract-layout"], function(_, Backbone, AbstractLayoutView) {
  var LessonPlanLayoutView;
  return LessonPlanLayoutView = AbstractLayoutView.extend({
    FILTER: "LessonPlanLayoutView.FILTER",
    events: {
      "click .lesson-plan-filter-wrapper li": "onFilterClick"
    },
    initialize: function(options_) {
      this.$li = $(".lesson-plan-filter-wrapper li");
      this.$plans = $(".lesson-plan-wrapper");
      app.utils.delay(1000, function() {
        return $(".bottom-sponsor").addClass("active");
      });
      return app.utils.delay(4000, function() {
        return $(".bottom-sponsor").removeClass("active");
      });
    },
    onFilterClick: function(e) {
      var $target, filter, plan, _i, _len, _ref, _results;
      this.$li.removeClass("active");
      $target = $(e.currentTarget);
      $target.addClass("active");
      filter = $target.data().filter;
      if (filter === "all") {
        return this.$plans.show();
      } else {
        this.$plans.hide();
        _ref = this.$plans;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          plan = _ref[_i];
          if ($(plan).hasClass(filter)) {
            _results.push($(plan).show());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    }
  });
});
