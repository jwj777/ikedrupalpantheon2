define(["underscore", "backbone", "masonry", "abstract-layout", "text!partials/searchTemplate.html"], function(_, Backbone, Masonry, AbstractLayoutView, searchTemplate) {
  var MobileSearchResultsLayoutView;
  return MobileSearchResultsLayoutView = AbstractLayoutView.extend({
    LOADED: "MobileSearchResultsLayoutView.LOADED",
    initialize: function(options_) {
      var accList, errElem, errStr, numMilestones, resultsStr,
        _this = this;
      this.$accordion = $('.accordion');
      this.query = options_.query;
      if (options_.type === 'array') {
        this.data = options_.results || [];
        this.hasResults = this.data.length > 0;
        this.search_template = _.template(searchTemplate);
        this.currentSearchTemplate = this.search_template({
          items: this.data
        });
        this.$accordion.prepend(this.currentSearchTemplate);
        if (this.hasResults) {
          resultsStr = this.data.length + ' RESULTS FOR ' + this.query.toUpperCase();
          $('.search-results-num').html(resultsStr);
          app.utils.delay(200, function() {
            return _this.trigger(_this.LOADED, $('.accordion-list.search'));
          });
        } else {
          resultsStr = '0 RESULTS FOR ' + this.query.toUpperCase();
          $('.search-results-num').html(resultsStr);
        }
      } else if (options_.type === 'error') {
        this.clear();
        accList = $('<li class="accordion-list search">');
        errStr = '0 RESULTS FOR ' + this.query.toUpperCase();
        errElem = $('<div class="search-results-num xs-mb-10 xs-ml-20">' + errStr + '</div>');
        accList.append(errElem);
        this.$accordion.append(accList);
      } else {
        this.data = options_.results || "";
        this.$accordion.prepend(this.data);
        numMilestones = $('.accordion-list.search').find('.grid-item');
        if (numMilestones.length === 1) {
          resultsStr = numMilestones.length + ' RESULT FOR ' + this.query.toUpperCase();
        } else {
          resultsStr = numMilestones.length + ' RESULTS FOR ' + this.query.toUpperCase();
        }
        $('.search-results-num').html(resultsStr);
        this.trigger(this.LOADED, $('.accordion-list.search'));
      }
      return $('.search-footer').click(function() {
        return $(".accordion-list.search").animate({
          scrollTop: '0px'
        }, {
          'duration': 400,
          'easing': 'linear'
        });
      });
    },
    clear: function() {
      return $('.accordion-list.search').remove();
    }
  });
});
