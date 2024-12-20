define(["jquery", "lp-timeline-app-config"], function($, LPTimelineAppConfig) {
  var AppConfig, obj;
  obj = {
    routes: {
      DEFAULT: "legacy"
    }
  };
  AppConfig = $.extend(LPTimelineAppConfig, obj);
  return AppConfig;
});
