define(["underscore", "backbone", "abstract-item-view"], function(_, Backbone, AbstractItemView) {
  var AbstractNavView;
  return AbstractNavView = AbstractItemView.extend({
    currentQuery: "",
    FILTER_AUTOCOMPLETE: "AbstractNavView.FILTER_AUTOCOMPLETE",
    RESULTS_DISPLAY: "AbstractNavView.RESULTS_DISPLAY",
    initialize: function() {},
    search: function(query_, autocomplete_, clear_) {
      var escapeQuery, query, queryURL, self,
        _this = this;
      if (autocomplete_ == null) {
        autocomplete_ = true;
      }
      self = this;
      query = query_;
      escapeQuery = escape(query.replace(/\//g, " "));
      //queryURL = window.base_url + "/modules/custom/ike_timeline/src/static/mock-data.json"
      queryURL = window.base_url + ("/timeline/search?term=" + escapeQuery);
      // queryURL = window.debug ? window.base_url + "/static/mock_data/search.json" : window.base_url + ("/search?term=" + escapeQuery);
      this.currentQuery = query;
      if (this.$ajax) {
        this.$ajax.abort();
      }
      return this.$ajax = $.get(queryURL, function(data) {
        if (!data.results) {
          data.results = [];
        }
        if (data.results) {
          if (autocomplete_) {
            return _this.trigger(_this.FILTER_AUTOCOMPLETE, data.results, query);
          } else {
            return _this.trigger(_this.RESULTS_DISPLAY, data.results, query);
          }
        }
      });
    },
    onResize: function(height_, width_) {
      /*
      AbstractLayoutView::onResize.call @, height_, width_

      $.fn.matchHeight._update()
      */

    }
  });
});
