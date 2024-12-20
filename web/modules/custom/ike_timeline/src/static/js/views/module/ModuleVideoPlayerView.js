define(["jquery", "underscore", "backbone", "videojs", "abstract-item-view"], function($, _, Backbone, vidJS, AbstractItemView) {
  var ModuleVideoPlayerView;
  return ModuleVideoPlayerView = AbstractItemView.extend({
    _isPlaying: false,
    _isLoaded: false,
    _actions: [],
    events: {
      "click .close-button": "_onCloseClick"
    },
    DESTROY_ON_CLOSE: true,
    params: {
      controls: true,
      autoplay: true,
      preload: "auto",
      loop: false,
      width: 800,
      height: 450,
      poster: ""
    },
    isReady: function() {
      return this._ready || false;
    },
    isOpen: function() {
      return this._isOpen || false;
    },
    /*
    
    REMOVE FOR NOW
    
    resize:(h_, w_) ->
      return 
      AbstractItemView::onResize.call @, h_, w_
      console.log 'resize', h_, w_
      @modalText = @$el.find(".asset-modal-text") unless @modalText
    
      return unless (@_video and @$window and @modalText)
    
      w_   = @$window.width() unless w_?
      h_   = @$window.height() unless h_?       
      maxH = @$window.height() - @modalText.height() - 170
      r    = 9/16   
      w    = w_ * (7/8)
      h    = w*r
    
      if h > maxH
        h = maxH
        w = maxH*(1/r)
      
      mt = (h_ - h)*0.5 - 60 # update to fix other distance fixes 
       
      if $(@_video.el).hasClass "fullscreen"
        p =
          "width" : ""
          "height" : "" 
          "margin-top" : "" 
      else
        p =
          "width" : w + "px"
          "height" : w*r + "px" 
          "margin-top" : mt+"px"
    
      @$el.css p
    */

    /*
    Args:
      videoURL : Array of video urls
      captionsURL : optional url to VTT file
      metadata : optional object containing related data to be used by sharing component, including:
        nid : id or nid of data object (for email)
        title : title string
        description : description string
        image: image url
        caption: caption string
    */

    setVideo: function(videoURL, captionsURL, metadata) {
      var _this = this;
      if (!this._video) {
        return this._initVideo(videoURL, captionsURL, metadata);
      }
      this._setTrack(captionsURL);
      this._isLoaded = false;
      this._setSources(videoURL, $video[0]);
      return this._video.ready(function() {
        var _results;
        _this._isLoaded = true;
        _results = [];
        while (_this._actions.length) {
          _results.push(_this._actions.shift().call());
        }
        return _results;
      });
    },
    setNavigation: function(elements) {
      var _this = this;
      this.$indicator = elements[0];
      this.$navigation = elements[1];
      this.$el.find('.carousel-indicators').remove();
      this.$el.append(this.$indicator);
      this.$el.append(this.$navigation);
      this.$indicator.find("li").click(function(e) {
        return _this.trigger("slide", $(e.currentTarget).data("index"));
      });
      this.$navigation.find(".left").click(function() {
        return _this.trigger("arrow", "previous");
      });
      return this.$navigation.find(".right").click(function() {
        return _this.trigger("arrow", "next");
      });
    },
    fullscreen: function(bool) {
      var _this = this;
      if (!(this._video && this._isLoaded)) {
        return this._actions.push(function() {
          return _this.fullscreen(bool);
        });
      }
      this._isFullscreen = bool;
      if (bool) {
        return this._video.requestFullScreen();
      } else {
        return this._video.cancelFullScreen();
      }
    },
    play: function() {
      var _this = this;
      if (!(this._video && this._isLoaded)) {
        return this._actions.push(function() {
          return _this.play();
        });
      }
      this._isPlaying = true;
      return this._video.play();
    },
    pause: function() {
      var _this = this;
      if (!(this._video && this._isLoaded)) {
        return this._actions.push(function() {
          return _this.pause();
        });
      }
      this._isPlaying = false;
      return this._video.pause();
    },
    stop: function() {
      var _this = this;
      if (!(this._video && this._isLoaded)) {
        return this._actions.push(function() {
          return _this.stop();
        });
      }
      this._isPlaying = false;
      this._video.currentTime(0);
      return this._video.pause();
    },
    open: function(autoplay) {
      var duration,
        _this = this;
      if (autoplay == null) {
        autoplay = true;
      }
      if (this._isOpen) {
        return;
      }
      this._isOpen = true;
      duration = 1200;
      this.$el.fadeIn({
        "duration": duration,
        "complete": function() {
          if (autoplay) {
            return _this.play();
          }
        }
      });
      this.trigger("open", this);
      return $(document).bind('keydown', this._onKeyDown);
    },
    close: function(zoomUI) {
      var _zoomUI,
        _this = this;
      if (zoomUI == null) {
        zoomUI = true;
      }
      if (!this._isOpen) {
        return;
      }
      this._isOpen = false;
      _zoomUI = zoomUI;
      $(document).unbind('keydown', this._onKeyDown);
      this.$navigation.find(".left").off();
      this.$navigation.find(".right").off();
      return this.$el.fadeOut({
        complete: function() {
          _this.stop();
          if (_zoomUI) {
            _this.trigger("closed", _this);
          }
          if (_this.DESTROY_ON_CLOSE) {
            return _this._removeVideo();
          }
        }
      });
    },
    initialize: function(args) {
      this.params = _.extend(this.params, args.params);
      if (Modernizr.iphone) {
        this.params["controls"] = false;
      }
      this._$error = this.$(".error-message");
      this._flashError = this.$("#flash-fallback-html").html();
      this._$container = this.$(".video-container").css({
        "width": "100%",
        "height": "100%"
      });
      this._$mediaWrapper = $(".milestone-media");
      if (args.source) {
        this._initVideo(args.source);
      }
      this.modalText = this.$el.find(".asset-modal-text");
      this.$window = $(window);
      _.bindAll(this, '_onKeyDown');
      return this._ready = true;
    },
    destroy: function() {
      this.params = null;
      this._actions = null;
      this._isLoaded = null;
      this._isPlaying = null;
      this._$error = null;
      this._flashError = null;
      this._$container = null;
      $(document).unbind("keydown", this._onKeyDown);
      if (this.$navigation) {
        this.$navigation.find(".left").off();
        this.$navigation.find(".right").off();
      }
      this._removeVideo();
      if (this.sharebox) {
        this.sharebox.destroy();
        this.sharebox = null;
      }
      return this.remove();
    },
    _initVideo: function(videoURL, captionsURL, metadata) {
      var $video,
        _this = this;
      this._$container.appendTo("body");
      $video = $(document.createElement("VIDEO")).appendTo(this._$container).attr({
        "class": "video-js vjs-default-skin ike-video",
        "width": this.params.width,
        "height": this.params.height,
        "controls": this.params.controls,
        "poster": this.params.poster
      });
      this._setSources(videoURL, $video[0]);
      this._setTrack(captionsURL, $video[0]);
      return _V_($video[0], this.params, function() {
        _this.$el.append(_this._$container);
        return _this._onPlayerReady($video[0]);
      });
    },
    _onPlayerReady: function(videoEl) {
      var _results,
        _this = this;
      if (!this.$window) {
        this.$window = $(window);
      }
      this._isLoaded = true;
      this._video = _V_(videoEl);
      this._video.addEvent("play", function() {
        return _this._onPlayerPlay();
      });
      this._video.addEvent("pause", function() {
        return _this._onPlayerPause();
      });
      this._video.addEvent("ended", function() {
        return _this._onPlayerFinish();
      });
      this._video.addEvent("loadeddata", function() {
        return _this._onLoadedData();
      });
      this._video.addEvent("fullscreenchange", function() {
        return _this._onFullScreen();
      });
      $(videoEl).find("track").remove();
      if (this.autoplay && !this.isMobile) {
        this.play();
      }
      _results = [];
      while (this._actions.length) {
        _results.push(this._actions.shift().call());
      }
      return _results;
    },
    _removeVideo: function() {
      if (!this._video) {
        return;
      }
      this._video.removeEvent("play");
      this._video.removeEvent("pause");
      this._video.removeEvent("ended");
      this._video.removeEvent("loadeddata");
      this._video.removeEvent("fullscreenchange");
      $(this._video.el).remove();
      return this._video = null;
    },
    _getType: function(url) {
      var ext;
      ext = url.split(".").pop().split("?").shift();
      switch (ext) {
        case "mp4":
        case "ogg":
        case "webm":
          return "video/" + ext;
        case "m3u8":
          return "application/x-mpegURL";
      }
    },
    _setSources: function(videoURL, videoElement) {
      var canPlayIt, sources,
        _this = this;
      canPlayIt = false;
      sources = _.map([videoURL], function(url) {
        var source;
        source = {
          src: url,
          type: _this._getType(url)
        };
        if (!canPlayIt) {
          canPlayIt = _V_["html5"].isSupported() && _V_["html5"].canPlaySource(source);
        }
        return source;
      });
      if (!(canPlayIt || _V_.flash.isSupported())) {
        this._$error.html(this._flashError);
        this._$error.show();
        this.trigger("error", this, "flash");
        return;
      }
      this._$error.hide();
      if (this._video) {
        this._video.src(sources);
        if (this._video.load != null) {
          return this._video.load();
        }
      } else {
        return _.each(sources, function(o) {
          var $source;
          return $source = $("<source />").appendTo(videoElement).attr(o);
        });
      }
    },
    _setTrack: function(captionsURL, videoElement) {
      var $track, track;
      if (captionsURL == null) {
        captionsURL = "";
      }
      if (Modernizr.iphone) {
        return;
      }
      if (this._video) {
        track = this._video.textTracks[0];
        if (!track) {
          return;
        }
        $(this._video.controlBar.captionsButton.menu.el).children().removeClass("vjs-selected");
        if (captionsURL === track.src) {
          return;
        }
        track.src = captionsURL;
        track.readyState = 0;
        return track.cues = [];
      } else {
        return $track = $(document.createElement("TRACK")).appendTo(videoElement).attr({
          "src": captionsURL,
          "kind": "captions",
          "srclang": "en",
          "label": "English",
          "language": "english"
        });
      }
    },
    _onCloseClick: function() {
      return this.close();
    },
    _onLoadedData: function() {
      return this.trigger("loadeddata", this);
    },
    _onPlayerPlay: function() {
      return this.trigger("play", this);
    },
    _onPlayerPause: function() {
      return this.trigger("pause", this);
    },
    _onPlayerFinish: function() {
      return this.trigger("ended", this);
    },
    _onFullScreen: function(event) {
      if (this._video == null) {
        return;
      }
      if (this._video.isFullScreen) {
        $(this._video.el).addClass("fullscreen");
      } else {
        $(this._video.el).removeClass("fullscreen");
      }
      return this.trigger("fullscreenchange", this);
    },
    _onKeyDown: function(e) {
      switch (e.which) {
        case 37:
          this.trigger("arrow", "previous");
          break;
        case 39:
          this.trigger("arrow", "next");
      }
      return e.preventDefault();
    }
  });
});
