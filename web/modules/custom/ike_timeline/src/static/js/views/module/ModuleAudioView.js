define(["jquery", "underscore", "backbone", "abstract-item-view"], function($, _, Backbone, AbstractItemView) {
  var ModuleAudioView;
  return ModuleAudioView = AbstractItemView.extend({
    initialize: function(options_) {
      return AbstractItemView.prototype.initialize.call(this);
      /*
      self = @
       
      $play     = @$el.find('.module-audio-player')
      $playBtn  = @$el.find('.audioplay-icon')
      $pauseBtn = @$el.find('.audiopause-icon')
      $remain   = @$el.find('.remaining')
      $total    = @$el.find('.total')
      
      @ws    = Object.create(WaveSurfer)
      @data  = options_.data
      url    = @data.downloaduri 
      id     = @data.id || 'wave'
      
      try 
          @ws.init
              container: $('#modal_'+id).get(0)
              waveColor: '#FFF'
              progressColor: '#81c0c6' 
              barWidth: 2
              height: 62 
              hideScrollbar: true
      
          @ws.on 'ready', =>
              updateDisplay()
      
              $play.click => 
                  @ws.playPause()
           
          @ws.on 'play', =>
              $playBtn.toggle()
              $pauseBtn.toggle()
              $play.addClass 'pause'
           
          @ws.on 'pause', =>
              $playBtn.toggle()
              $pauseBtn.toggle()
              $play.removeClass 'pause'
           
          @ws.on 'audioprocess', =>
              updateDisplay()
           
          @ws.load url
      catch e 
          console.log "AUDIO ERROR", e
      
      
      updateDisplay = ->
          return unless self.ws
          
          current = app.utils.millisecondsToTime( self.ws.getCurrentTime()*1000 )
          total = app.utils.millisecondsToTime( self.ws.getDuration()*1000 )
      
          $remain.text current
          $total.text total
      */

    },
    destroy: function() {
      this.ws = null;
      return LPTimelineAbstractItemView.prototype.destroy.call(this);
    }
  });
});
