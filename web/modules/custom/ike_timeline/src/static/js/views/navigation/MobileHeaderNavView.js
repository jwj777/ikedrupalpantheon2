define(["underscore", "backbone", "abstract-nav-view"], function(_, Backbone, AbstractNavView) {
  var MobileHeaderNavView;
  return MobileHeaderNavView = AbstractNavView.extend({
    RESULTS_DISPLAY: "MobileHeaderNavView.RESULTS_DISPLAY",
    FILTER_AUTOCOMPLETE: "MobileHeaderNavView.FILTER_AUTOCOMPLETE",
    CLEAR: "MobileHeaderNavView.CLEAR",
    MAX_CHARS: 300,
    EMAIL_URL: "/content/share-page",
    FACEBOOK_SHARE_URL: "https://www.facebook.com/dialog/share",
    TWITTER_SHARE_URL: "https://twitter.com/share",
    GOOGLEPLUS_SHARE_URL: "https://plus.google.com/share",
    title_text: "Eisenhower Interactive Timeline",
    events: {
      "click .facebook-icon": "onFacebookClick",
      "click .twitter-icon": "onTwitterClick",
      "click .mail-icon": "onEmailClick",
      "click .google-icon": "onGoogleClick",
      "click .search-icon": "searchInput",
      "click .view-desktop-version": "onDesktopClick"
    },
    initialize: function() {
      var _this = this;
      this.$headerHiddenNav = $(".top-nav-open");
      this.$searchInputEl = $('.top-nav-search');
      this.$accordion = $('.accordion');
      $(".nav-icon").click(this.showHeader);
      $(".top-nav-menu-container .close-icon").click(this.showHeader);
      app.eventBus.on(app.appConfig.events.SEARCH_CLEAR, function() {
        return _this.clear();
      });
      this.setContents();
      this.$close = this.$searchInputEl.find(".close-small-icon");
      this.$close.click(function() {
        return app.eventBus.trigger(app.appConfig.events.SEARCH_CLEAR);
      });
      this.$search = $("#mobileSearch");
      return this.$search.keyup(function(e) {
        if (e.which === 13) {
          _this.search(_this.$search.val(), false);
          return _this.$searchInputEl.find('input').blur();
        } else {
          if (_this.$search.val() !== '') {
            return _this.search(_this.$search.val(), true);
          }
        }
      });
    },
    search: function(query_, autocomplete_, clear_) {
      var escapeQuery, query, queryURL, self,
        _this = this;
      if (autocomplete_ == null) {
        autocomplete_ = true;
      }
      self = this;
      query = query_;
      escapeQuery = escape(query.replace(/\//g, " "));
      //queryURL = window.debug ? window.base_url + "/static/mock_data/search.json" : window.base_url + ("/search?term=" + escapeQuery);
      queryURL = window.base_url + ("/timeline/search?term=" + escapeQuery);
      this.currentQuery = query;
      if (this.$ajax) {
        this.$ajax.abort();
      }
      if (autocomplete_) {
        return;
      }
      return this.$ajax = $.get(queryURL, function(data) {
        console.log(data);
        if (data.results) {
          if (autocomplete_) {
            return _this.trigger(_this.FILTER_AUTOCOMPLETE, data.results, query);
          } else {
            return _this.trigger(_this.RESULTS_DISPLAY, data.results, query);
          }
        } else {
          if (autocomplete_) {
            return _this.trigger(_this.FILTER_AUTOCOMPLETE, data, query);
          } else {
            return _this.trigger(_this.RESULTS_DISPLAY, data, query);
          }
        }
      }).fail(function(error) {
        if (error.status === 404) {
          return _this.trigger(_this.RESULTS_DISPLAY, '' + error.status, query);
        }
      });
    },
    showHeader: function(event) {
      var tn;
      tn = $(".top-nav-open");
      if (tn.hasClass("active")) {
        tn.removeClass("active");
        tn.css("height", 0);
      } else {
        tn.addClass("active");
        tn.css("height", window.innerHeight);
      }
      return tn.find(".social-icons span").addClass("inactive");
    },
    searchInput: function(event) {
      if (this.$searchInputEl.hasClass('show')) {
        return app.eventBus.trigger(app.appConfig.events.SEARCH_CLEAR);
      } else {
        this.$searchInputEl.addClass('show');
        this.$accordion.addClass('fade');
        return $('#mobileSearch').focus();
      }
    },
    setContents: function() {
      var contents;
      contents = {};
      contents["url"] = contents["url"] || window.location;
      contents["caption"] = contents["title"] || "";
      contents["title"] = $("meta[property='og:title']").attr("content") || "";
      contents["image"] = contents["image"] || $("meta[property='og:image']").attr("content") || "";
      contents["description"] = contents["description"] || $("meta[property='og:description']").attr("content") || "";
      if (contents["description"].length > this.MAX_CHARS) {
        contents["description"] = contents["description"].substr(0, this.MAX_CHARS) + "...";
      }
      return this._contents = contents;
    },
    getContents: function() {
      return this._contents;
    },
    onDesktopClick: function() {
      if (window.location.href.lastIndexOf('request_desktop') === -1) {
        return window.location.href = window.location.href + "?request_desktop=1&";
      }
    },
    onFacebookClick: function() {
      $('.facebook-icon.inactive').removeClass('inactive');
      return this.getFacebookSharer(this.getContents, {
        appId: "286058441531272"
      });
    },
    onTwitterClick: function() {
      $('.twitter-icon.inactive').removeClass('inactive');
      return this.getTwitterSharer(this.getContents);
    },
    onGoogleClick: function() {
      $('.googleplus-icon.inactive').removeClass('inactive');
      return this.getGooglePlusSharer(this.getContents);
    },
    onEmailClick: function() {
      var body, subject;
      $('.email-icon.inactive').removeClass('inactive');
      subject = encodeURIComponent(this.title_text);
      body = encodeURIComponent("View link at " + window.location);
      return window.location.href = "mailto:?subject=" + subject + "&body=" + body;
    },
    getFacebookSharer: function(contents, params) {
      var args;
      if (contents == null) {
        contents = {};
      }
      if (params == null) {
        params = {};
      }
      args = {};
      args.url = this.FACEBOOK_SHARE_URL;
      args.url += "?app_id=" + encodeURIComponent(params.appId);
      args.url += "&display=popup";
      if (contents.caption) {
        args.url += "&caption=" + encodeURIComponent(contents.caption.replace(/<[^>]*>/gi, ""));
      } else {
        args.url += "&caption=" + this.title_text;
      }
      args.url += "&href=" + encodeURIComponent(contents.url || window.location);
      args.url += "&redirect_uri=" + encodeURIComponent(contents.redirect || "http://www.facebook.com");
      return this.getSharer(args);
    },
    getGooglePlusSharer: function(contents, params) {
      var args;
      if (contents == null) {
        contents = {};
      }
      if (params == null) {
        params = {};
      }
      args = {};
      // args.url = params.apiUrl || this.GOOGLEPLUS_SHARE_URL;
      // args.url += "?url=" + encodeURIComponent(contents.url || window.location);
      args.url = "https://www.youtube.com/user/EisenhowerMemorial";
      return this.getSharer(args);
    },
    getTwitterSharer: function(contents, params) {
      var args;
      if (contents == null) {
        contents = {};
      }
      if (params == null) {
        params = {};
      }
      args = {};
      args.url = params.apiUrl || this.TWITTER_SHARE_URL;
      args.url += "?text=" + this.title_text;
      return this.getSharer(args);
    },
    getSharer: function(args) {
      var specs;
      if (args == null) {
        args = {};
      }
      specs = "location=no,menubar=no,status=no,titlebar=no,toolbar=no";
      specs += ",width=" + (args.width || 980);
      specs += ",height=" + (args.height || 610);
      specs += ",top=" + (args.top || 10);
      specs += ",left=" + (args.left || 10);
      return window.open(args.url, "_blank", specs);
    },
    clear: function() {
      this.$searchInputEl.removeClass('show');
      this.$accordion.removeClass('fade');
      return this.$search.val("");
    }
  });
});
