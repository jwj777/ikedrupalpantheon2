define(["underscore", "backbone"], function(_, Backbone) {
  var AppRouter;
  return AppRouter = Backbone.Router.extend({
    EVENT_HASH_CHANGED: 'AppRouter.EVENT_HASH_CHANGED',
    currentPage: '',
    initialize: function() {
      this.route(window.base_url, 'defaultAction');
      this.route(window.base_url + '/', 'defaultAction');
      this.route(window.base_url + '/:id', 'pathChange');
      this.route(window.base_url + '/:id/', 'pathChange');
      this.route(window.base_url + '/:id/:subid', 'pathChange');
      this.route(window.base_url + '/:id/:subid/', 'pathChange');
      this.route(window.base_url + '/:id/:subid/:subsubid', 'pathChange');
      this.route(window.base_url + '/:id/:subid/:subsubid/', 'pathChange');
      this.route(window.base_url + '/:id/:subid/:subsubid/@actions', 'pathChange');
      return this.route(window.base_url + '/*actions', 'defaultAction');
    },
    pathChange: function(id_, subId_, subSubId_, actions_) {
      var currentPage;
      if (id_ == null) {
        id_ = null;
      }
      if (subId_ == null) {
        subId_ = null;
      }
      if (subSubId_ == null) {
        subSubId_ = null;
      }
      if (actions_ == null) {
        actions_ = null;
      }
      console.log('pathChange-----', id_, subId_, subSubId_, actions_, app.appConfig.routes);
      if (app.utils.valueInObject(id_, app.appConfig.routes)) {
        currentPage = '/';
        if (id_) {
          currentPage += id_;
          currentPage += '/';
          if (subId_) {
            currentPage += subId_;
            currentPage += '/';
            if (subSubId_) {
              currentPage += subSubId_;
              currentPage += '/';
            }
          }
        }
        if (currentPage !== this.currentPage) {
          this.currentPage = currentPage;
          return this.trigger(this.EVENT_HASH_CHANGED, id_, subId_, subSubId_);
        }
      }
    },
    defaultAction: function(actions_) {
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
