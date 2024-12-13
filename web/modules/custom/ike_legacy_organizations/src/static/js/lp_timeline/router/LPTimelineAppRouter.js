define(["jquery", "underscore", "backbone"], function($, _, Backbone) {
  var LPTimelineAppRouter;
  return LPTimelineAppRouter = Backbone.Router.extend({
    EVENT_HASH_CHANGED: 'EVENT_HASH_CHANGED',
    DIRECTORY_DEEPLINK: 'DIRECTORY_DEEPLINK',
    MAP_DEEPLINK: 'MAP_DEEPLINK',
    currentPage: '',
    routes: {
      ':id': 'pathChange',
      '/:id': 'pathChange',
      ':id/': 'pathChange',
      '/:id/': 'pathChange',
      ':id/:subid': 'pathChange',
      '/:id/:subid': 'pathChange',
      ':id/:subid/': 'pathChange',
      '/:id/:subid/': 'pathChange',
      ':id/:subid/:subsubid': 'pathChange',
      '/:id/:subid/:subsubid': 'pathChange',
      ':id/:subid/:subsubid/': 'pathChange',
      '/:id/:subid/:subsubid/': 'pathChange',
      ':id/:subid/:subsubid/*actions': 'pathChange',
      '/:id/:subid/:subsubid/*actions': 'pathChange',
      '*actions': 'default'
    },
    pathChange: function(id_, subId_, subSubId_) {
      var path;
      console.log("pathChange", id_, subId_, subSubId_, app.appConfig);
      if (app.utils.valueInObject(id_, app.appConfig.routes)) {
        path = "/" + id_;
        if (subId_) {
          path += "/" + subId_;
        }
        if (subSubId_) {
          path += "/" + subSubId_;
        }
        if (path !== this.currentPage) {
          this.currentPage = path;
          if (typeof ga !== "undefined" && ga !== null) {
            ga('send', 'pageview', {
              'page': path
            });
          }
          return this.trigger(this.EVENT_HASH_CHANGED, id_, subId_, subSubId_);
        }
      }
    },
    "default": function(actions_) {
      return this.pathChange(app.appConfig.routes.DEFAULT);
    },
    navigateTo: function(path_) {
      if (Modernizr.history) {
        return this.navigate(path_, {
          trigger: true
        });
      } else {
        return window.location.pathname = path_;
      }
    }
  });
});
