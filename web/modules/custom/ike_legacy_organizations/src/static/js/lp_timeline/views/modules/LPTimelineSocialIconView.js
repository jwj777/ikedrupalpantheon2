define(["jquery", "underscore", "backbone", "lp_timeline/views/LPTimelineAbstractItemView"], function($, _, Backbone, LPTimelineAbstractItemView) {
  var LPTimelineSocialIconView;
  return LPTimelineSocialIconView = LPTimelineAbstractItemView.extend({
    FACEBOOK_URL: "https://www.facebook.com/",
    FOURSQUARE_URL: "https://foursquare.com/",
    TWITTER_URL: "https://twitter.com/",
    TUMBLR_URL: "https://www.tumblr.com/tagged/",
    INSTAGRAM_URL: "http://instagram.com/",
    PINTEREST_URL: "https://www.pinterest.com/",
    VIMEO_URL: "https://vimeo.com/",
    events: {
      "click .fb-icon": "onFacebookClick",
      "click .fb-icon-ftr": "onFacebookClick",
      "click .fb-icon-hdr": "onFacebookClick",
      "click .foursq-icon": "onFoursquareClick",
      "click .foursq-icon-ftr": "onFoursquareClick",
      "click .foursq-icon-hdr": "onFoursquareClick",
      "click .twitter-icon": "onTwitterClick",
      "click .twitter-icon-ftr": "onTwitterClick",
      "click .twitter-icon-hdr": "onTwitterClick",
      "click .tumblr-icon": "onTumblrClick",
      "click .tumblr-icon-ftr": "onTumblrClick",
      "click .tumblr-icon-hdr": "onTumblrClick",
      "click .instagram-icon": "onInstagramClick",
      "click .instagram-icon-ftr": "onInstagramClick",
      "click .instagram-icon-hdr": "onInstagramClick",
      "click .pinterest-icon": "onPinterestClick",
      "click .pinterest-icon-ftr": "onPinterestClick",
      "click .pinterest-icon-hdr": "onPinterestClick",
      "click .vimeo-icon": "onVimeoClick",
      "click .vimeo-icon-ftr": "onVimeoClick",
      "click .vimeo-icon-hdr": "onVimeoClick"
    },
    initialize: function(args) {},
    onFacebookClick: function() {
      return window.open(this.FACEBOOK_URL, "_blank");
    },
    onFoursquareClick: function() {
      return window.open(this.FOURSQUARE_URL, "_blank");
    },
    onTwitterClick: function() {
      return window.open(this.TWITTER_URL, "_blank");
    },
    onTumblrClick: function() {
      return window.open(this.TUMBLR_URL, "_blank");
    },
    onInstagramClick: function() {
      return window.open(this.INSTAGRAM_URL, "_blank");
    },
    onPinterestClick: function() {
      return window.open(this.PINTEREST_URL, "_blank");
    },
    onVimeoClick: function() {
      return window.open(this.VIMEO_URL, "_blank");
    }
  });
});
