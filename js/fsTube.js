/*
    fsTube Vincent Egurbide

    Big Video JS youtube player tubular ouais !!!!
*/
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery'
        ], factory);
    } else {
        factory(jQuery);
    }
})(function($) {

    $.fsTube = function(options) {
        var defaults = {
            ratio: 16/9, // usually either 4/3 or 16/9 -- tweak as needed
            videoId: 'wXw6znXPfy4', // toy robot in space is a good default, no?
            mute: true,
            repeat: false,
            width: $(window).width(),
            wrapperZIndex: 99,
            increaseVolumeBy: 10,
            start: 0,
            $target : $(options.target)
        };
        defaults.template = [
            '<div id="fsTube-container" style="overflow: hidden; position: fixed; z-index: 1; width: 100%; height: 100%">',
                '<div id="fsTube-player" style="position: absolute"></div>',
            '</div>',
            '<div id="fsTube-shield" style="width: 100%; height: 100%; z-index: 2; position: absolute; left: 0; top: 0;"></div>'
        ].join('\n');

        var settings = $.extend({}, defaults, options);
        var state = {
            ytInitialized : false
        };

        var fsTube = this;

        function updateSize() {
            var width = $(window).width(),
                pWidth, // player width, to be defined
                height = $(window).height(),
                pHeight, // player height, tbd
                $tubularPlayer = $('#fsTube-player');

            // when screen aspect ratio differs from video, video must center and underlay one dimension

            if (width / settings.ratio < height) { // if new video height < window height (gap underneath)
                pWidth = Math.ceil(height * settings.ratio); // get new player width
                $tubularPlayer.width(pWidth).height(height).css({left: (width - pWidth) / 2, top: 0}); // player width is greater, offset left; reset top
            } else { // new video width < window width (gap to right)
                pHeight = Math.ceil(width / settings.ratio); // get new player height
                $tubularPlayer.width(width).height(pHeight).css({left: 0, top: (height - pHeight) / 2}); // player height is greater, offset top; reset left
            }
        }

        function onPlayerReady(e){
            updateSize();
            if (settings.mute) e.target.mute();
            $(document).trigger('ytPlayerReady')
        }

        function onPlayerStateChange(state){
            $(document).trigger('ytPlayerStateChange');
            if (state.data === 0 && settings.repeat) { // video ended and repeat option is set true
                fsTube.player.seekTo(settings.start); // restart
            }
        }

        function initYT(){
            if(!state.ytInitialized){
                state.ytInitialized = true;
            } else {
                console.log(fsTube)
                fsTube.player.destroy();
            }


            fsTube.player = new YT.Player('fsTube-player', {
                width: settings.width,
                height: Math.ceil(settings.width / settings.ratio),
                videoId: settings.videoId,
                playerVars: {
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    wmode: 'transparent'
                },
                events: {
                    'onReady': (function(e){
                        return function(e) {
                            onPlayerReady(e);
                        }
                    })(),
                    'onStateChange': (function(e){
                        return function(e) {
                            onPlayerStateChange(e);
                        }
                    })()
                }
            });
        }

        fsTube.init = function(){
            console.log('init')
            settings.$target.append(settings.template);

            window.onYouTubeIframeAPIReady = function() {
                initYT();
            }
            $(window).on('resize.fsTube', function() {
                updateSize();
            })

            var tag = document.createElement('script');
            tag.src = "//www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        };

        fsTube.play = function(){
            fsTube.player.playVideo();
        };

        fsTube.state = function(){
            return fsTube.player.getPlayerState();
        };

        fsTube.setVideo = function(id){
            console.log(id)
            settings.videoId = id;

            if(!state.ytInitialized)
                fsTube.init();
            else
                initYT();
        };

    };
});