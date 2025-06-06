// Generated by CoffeeScript 1.8.0
(function() {
  define(["underscore", "backbone"], function(_, Backbone) {
    return Backbone.Model.extend({
      defaults: {
        image_url: "",
        image_url_l: "",
        image_url_m: "",
        image_url_s: ""
      },
      parse: function(o) {
        o["image_url"] = o["image_url"] || o["image_url_l"] || o["image_url_m"] || o["image_url_s"];
        o["image_url_l"] = o["image_url_l"] || o["image_url"] || o["image_url_m"] || o["image_url_s"];
        o["image_url_m"] = o["image_url_m"] || o["image_url_l"] || o["image_url"] || o["image_url_s"];
        o["image_url_s"] = o["image_url_s"] || o["image_url_m"] || o["image_url_l"] || o["image_url"];
        return o;
      }
    });
  });

}).call(this);
