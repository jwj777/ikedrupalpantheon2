(function($){
    $.fn.lbSlider = function(options) {

        var returnObj = $.extend({
            leftBtn: '.leftBtn',
            rightBtn: '.rightBtn',
            visible: 1,
            autoPlay: false,  // true or false
            autoPlayDelay: 10,  // delay in seconds
            speed: 1000,
            onComplete: function(){ console.log('lbSlider slide finished'); },
            "isDisabled":false,
            "isPaused":false,
            "index":0
        }, options);

        var make = function() {
            var $this = $(this)
            $this.css('overflow', 'hidden');
             
            var thisWidth = $this.width();
            var mod = thisWidth % returnObj.visible;
            if (mod) {
                $this.width(thisWidth - mod); // to prevent bugs while scrolling to the end of slider
            }
            
            var el = $this.children('ul');
            el.css({
                position: 'relative',
                left: '0'
            });

            var leftBtn = $(returnObj.leftBtn), 
                rightBtn = $(returnObj.rightBtn);

            var sliderFirst = el.children('li').slice(0, returnObj.visible);
            var tmp = '';
            sliderFirst.each(function(){
                var $li = $(this);
                tmp = tmp + '<li class="'+ $li.attr("class") +' " style="'+ $li.attr("style") +'" >' + $li.html() + '</li>';
            });
            var sliderFirstTxt = tmp;
            
            var sliderLast = el.children('li').slice(-returnObj.visible);
            tmp = '';
            sliderLast.each(function(){
                var $li = $(this);
                tmp = tmp + '<li class="'+ $li.attr("class") +' " style="'+ $li.attr("style") +'" >' + $li.html() + '</li>';
            });
            var sliderLastTxt = tmp;

            var elRealQuant = el.children('li').length;
            el.append(sliderFirstTxt);
            el.prepend(sliderLastTxt);
            var elQuant = el.children('li').length;
            var elWidth = (1/elQuant)*100;
            el.children('li').css({
                float: 'left',
                width: elWidth+ '%'
            });
            
            el.width(elQuant * 100 + '%');
            el.css('left', '-' + 100 * returnObj.visible + '%');

            function disableButtons() {
                console.log("START");
                returnObj.isDisabled = true;
                leftBtn.addClass('inactive');
                rightBtn.addClass('inactive');
            }
            function enableButtons() {
                console.log("FINISH");
                returnObj.isDisabled = false;
                leftBtn.removeClass('inactive');
                rightBtn.removeClass('inactive');
            }

            returnObj.onLeftClick = function(speed_){
                var speed = speed_ || returnObj.speed;
                if (!returnObj.isDisabled) {
                    disableButtons();
                    returnObj.index--;
                    goTo = -(returnObj.index+1)*100+"%";
                    //console.log("left speed",speed);
                    el.stop().animate({left: goTo}, speed, 
                        function(){ 
                            if (returnObj.index == -1) { 
                                el.css('left', '-' + 100 * elRealQuant + '%');
                                returnObj.index = elRealQuant-1;
                            }
                            enableButtons();
                            returnObj.onComplete();
                        }
                    );
                }
                return false;
            } 

            returnObj.onRightClick = function(speed_){
                var speed = speed_ || returnObj.speed;
                if (!returnObj.isDisabled) {
                    disableButtons();
                    returnObj.index++;
                    goTo = -(returnObj.index+1)*100+"%";
                    //console.log("right speed",speed);
                    el.stop().animate({left: goTo}, speed,
                        function(){ 
                            if (returnObj.index == elRealQuant) {
                                el.css('left', '-' + 100 * returnObj.visible + '%');
                                returnObj.index = 0;
                            }
                            enableButtons();
                            returnObj.onComplete();
                        }
                    );
                }
                return false;
            }

            leftBtn.click(function(event){
                event.preventDefault();
                returnObj.onLeftClick()
            });

            rightBtn.click(function(event){
                event.preventDefault();
                returnObj.onRightClick()
            });

            if (returnObj.autoPlay) {
                function aPlay() {
                    if (!returnObj.isPaused){
                        returnObj.onRightClick();
                    }
                    delId = setTimeout(aPlay, returnObj.autoPlayDelay * 1000);
                }
                var delId = setTimeout(aPlay, returnObj.autoPlayDelay * 1000);
                el.hover(
                    function() {
                        clearTimeout(delId);
                    },
                    function() {
                        delId = setTimeout(aPlay, returnObj.autoPlayDelay * 1000);
                    }
                );
            }

            returnObj.killAutoPlay = function(){
                clearTimeout(delId);
            };
        };

        returnObj.made = this.each(make);
        return returnObj;
    };
})(jQuery);
