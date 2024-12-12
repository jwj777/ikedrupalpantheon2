define(["jquery", "underscore", "backbone", "abstract-item-view"], function($, _, Backbone, AbstractItemView) {
  var ShareSaveView;
  return ShareSaveView = AbstractItemView.extend({
    MAX_CHARS: 300,
    EMAIL_URL: "/content/share-page",
    FACEBOOK_SHARE_URL: "https://www.facebook.com/sharer/sharer.php",
    TWITTER_SHARE_URL: "https://twitter.com/share",
    GOOGLEPLUS_SHARE_URL: "https://plus.google.com/share",
    events: {
      "click .sharing-item.facebook": "onFacebookClick",
      "click .sharing-item.twitter": "onTwitterClick",
      "click .sharing-item.email": "onEmailClick",
      "click .sharing-item.googleplus": "onGoogleClick",
      "mouseover .share-icon": "showList",
      "mouseleave .sharing-list": "hideList"
    },
    getContents: function() {
      return this._contents;
    },
    setContents: function(contents) {
      contents = contents || {};
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
    initialize: function(args) {
      AbstractItemView.prototype.initialize.call(this);
      args = args || {};
      this.$list = this.$el.find(".sharing-list").removeClass("is-invisible").hide();
      return this.setContents(args.contents);
    },
    showList: function() {
      return this.$list.show();
    },
    hideList: function() {
      return this.$list.hide();
    },
    onFacebookClick: function() {
      return this.getFacebookSharer(this.getContents(), {
        appId: "286058441531272"
      });
    },
    onTwitterClick: function() {
      return this.getTwitterSharer(this.getContents());
    },
    onGoogleClick: function() {
      return this.getGooglePlusSharer(this.getContents());
    },
    onEmailClick: function() {
      var body, subject;
      subject = encodeURIComponent("The Dwight E. Eisenhower Interactive Timeline");
      body = encodeURIComponent(window.location);
      return window.location.href = "mailto:?subject=" + subject + "&body=" + body;
    },
    /*
        Contents (see header instructions)
        Params:
            apiUrl: new or default TWITTER_SHARE_URL
    */

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
      args.url += "?text=" + encodeURIComponent("The Dwight E. Eisenhower Interactive Timeline");
      args.url += "&url=" + encodeURIComponent(contents.url || window.location);
      return this.getSharer(args);
    },
    /*
        Contents (see header instructions)
        Params:
            appId: App ID
            apiUrl: new or default TWITTER_SHARE_URL
    */

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
      args.url += "?u=" + encodeURIComponent(contents.url || window.location);
      // if (contents.title) {
      //   args.url += "&name=" + encodeURIComponent(contents.title.replace(/<[^>]*>/gi, ""));
      // }
      // if (contents.description) {
      //   args.url += "&description=" + encodeURIComponent(contents.description.replace(/<[^>]*>/gi, ""));
      // }
      // if (contents.image) {
      //   args.url += "&picture=" + encodeURIComponent(contents.image);
      // }
      // if (contents.caption) {
      //   args.url += "&caption=" + encodeURIComponent(contents.caption.replace(/<[^>]*>/gi, ""));
      // }
      return this.getSharer(args);
    },
    /*
        Contents (see header instructions)
        Params:
            apiUrl: new or default TWITTER_SHARE_URL
    */

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
    /*
    Common function to display new window to share. Can be used for new APIs or internal services like email sharing
    Args:
        url: string url to share api with GET args
        width: window width
        height: window height
        top: window top
        left: window left
    */

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
    destroy: function() {
      this.$el.off("mouseover").off("mouseleave").find("a").off("click");
      return this.remove();
    }
  });
});
