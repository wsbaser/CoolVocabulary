export default class LingueeHandlers{
    constructor(){
        this.gAudio = null ;
        this.gHideSoundFlagsTimer = false;
        this.gIsOverSound = false;
        //var preferredMp3Langs = new Array();
        this.buttonPlaying = $();
        this.buttonPlayingTime = 0;
    }

    hideSoundFlags() {
        if (!this.gIsOverSound) {
            $("#soundFlags").slideUp();
            this.buttonPlaying.removeClass("playing").removeClass("loading");
        }
    }
    
    clearHideSoundFlagsTimer() {
        if (this.gHideSoundFlagsTimer) {
            clearTimeout(this.gHideSoundFlagsTimer)
        }
    }
    
    startHideSoundFlagsTimer() {
        this.clearHideSoundFlagsTimer();
        this.gHideSoundFlagsTimer = setTimeout(this.hideSoundFlags.bind(this), 2000);
    }
    
    outSound() {
        if (this.gAudio == null ) {
            this.startHideSoundFlagsTimer()
        }
        this.gIsOverSound = false
    }
    
    overSound() {
        this.gIsOverSound = true;
        this.clearHideSoundFlagsTimer()
    }
    
    clearAudio(a) {
        this.gAudio = null ;
        $("#soundFlags li.playing").removeClass("playing");
        if (this.soundCurrentlyPlaying) {
            this.soundCurrentlyPlaying.parent().removeClass("playing")
        }
        this.buttonPlaying.removeClass("playing").removeClass("loading");
        $("#audio-player").remove();
        if (a) {
            this.startHideSoundFlagsTimer()
        }
    }
    
    audioPlayingStarted() {
        this.soundCurrentlyPlaying.parent().addClass("playing")
    }
    
    audioPlayingDidFinish() {
        this.clearAudio(true);
    }
    
    audioPlayingError() {
        this.clearAudio(true)
    }
    
    playSoundWithAudioPrefix(a) {
        a = 'http://linguee.com'+a;
        $("#audio-player").remove();
        $("body").prepend($("<audio id='audio-player'><source src='" + a + ".mp3' type='audio/mpeg'><source src='" + a + ".ogg' type='audio/ogg'></audio>"));
        this.gAudio = $("#audio-player").get(0);
        // if (!(b.play instanceof Function)) {
        //     $(b).append("<object classid='clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6' style='display:none;'><param name='URL' value='" + a + ".mp3' /><param name='uiMode' value='invisible' /></object>");
        //     b = $("#audio-player object").get(0);
        //     b.play = function() {
        //         this.controls.play()
        //     }
        //     ;
        //     b.pause = function() {
        //         this.controls.pause()
        //     }
        //     ;
        //     b.isPlaying = function() {
        //         var d = this.playState;
        //         return d == 3 || d == 6 || d == 7
        //     }
        //     ;
        //     b.finishTimer = window.setInterval(function() {
        //         if (!b.isPlaying()) {
        //             clearAudio(true);
        //             window.clearInterval(b.finishTimer)
        //         }
        //     }, 1000);
        //     soundCurrentlyPlaying.parent().addClass("playing")
        // }
        this.gAudio.addEventListener('ended', this.audioPlayingDidFinish.bind(this));
        this.gAudio.addEventListener('playing', this.audioPlayingStarted.bind(this));
        this.gAudio.addEventListener('error', this.audioPlayingError.bind(this));
        this.gAudio.play()
    }
    
    mp3LangFromHash(a) {
        return (typeof a != "undefined") ? a.replace(/\/.*$/, "") : a
    }
    // function preferredHash(e, b, a) {
    //     for (var d = 0; d < preferredMp3Langs.length; d++) {
    //         if (typeof e != "undefined" && mp3LangFromHash(e) == preferredMp3Langs[d]) {
    //             return e
    //         }
    //         if (typeof b != "undefined" && mp3LangFromHash(b) == preferredMp3Langs[d]) {
    //             return b
    //         }
    //         if (typeof a != "undefined" && mp3LangFromHash(a) == preferredMp3Langs[d]) {
    //             return a
    //         }
    //     }
    //     return e
    // }

    play(f, g, b) {
        var e = $(f);
        this.clearHideSoundFlagsTimer();
        $("#soundFlags").stop(true, false);
        if (this.gAudio) {
            this.clearAudio(false)
        }
        e.removeClass("playing");
        this.soundCurrentlyPlaying = e;
        this.playSoundWithAudioPrefix("/mp3/" + b);
        // var a = mp3LangFromHash(b);
        // for (var d = 0; d < preferredMp3Langs.length; ) {
        //     if (preferredMp3Langs[d] == a) {
        //         preferredMp3Langs.splice(d, 1)
        //     } else {
        //         d++
        //     }
        // }
        // preferredMp3Langs.splice(0, 0, a);
        // $.cookie("preferredMp3Langs", preferredMp3Langs.join(), {
        //     path: "/",
        //     expires: 360
        // })
    }

    soundFlags() {
        var self = this;
        var a = $("#soundFlags");
        if (a.length == 0) {
            a = $("<div id='soundFlags'>");
            $("#linguee_article").append(a);
            if (!this.is_touch_device()) {
                a.mouseenter(function() {
                    self.overSound()
                });
                a.mouseleave(function() {
                    self.outSound()
                })
            }
        }
        return a
    }

    onPlayRegional(){
        this.play(window.event.target, 0, window.event.target.dataset.soundurl);
    }

    playSound(r, h, q, g, m, f, j) {
        var w = $(r);
        var a = $(r).hasClass("playing");
        this.clearHideSoundFlagsTimer();
        $("#soundFlags").stop(true, false);
        if (this.buttonPlayingTime == 0 || (new Date().getTime() - this.buttonPlayingTime) > 1000) {
            this.buttonPlaying = $();
        }
        if (this.gAudio) {
            this.clearAudio(false);
            this.hideSoundFlags();
            this.buttonPlaying = $();
            $(".button_audio.playing").removeClass("playing")
        }
        if (!a) {
            var u = this.soundFlags();
            var C = h;// preferredHash(h, g, f);
            var d = this.mp3LangFromHash(h);
            this.soundCurrentlyPlaying = w;
            if (arguments.length >= 3 && (d == "PT_PT" || d == "PT_BR" || d == "EN_US" || d == "EN_UK")) {
                //var s = w.closest(".translation.expanded");
                var B = $("#linguee_article");
                var n = -1;
                var l = -1;
                var z = "flagsmall";
                var A = "<ul class='soundFlagsList'><li" + (C == h ? " class='playing'" : "") + "><a data-soundurl='" + h + "'><span class='loudspeaker'></span><span class='" + z + " " + z + "_" + this.flagCodeFor(this.mp3LangFromHash(h)) + "'></span>" + q + "</a></li>";
                if (arguments.length >= 5) {
                    A += "<li" + (C == g ? " class='playing'" : "") + "><a data-soundurl='" + g + "'><span class='loudspeaker'></span><span class='" + z + " " + z + "_" + this.flagCodeFor(this.mp3LangFromHash(g)) + "'></span>" + m + "</a></li>"
                }
                if (arguments.length >= 7) {
                    A += "<li" + (C == f ? " class='playing'" : "") + "><a data-soundurl='" + f + "'><span class='loudspeaker'></span><span class='" + z + " " + z + "_" + this.flagCodeFor(this.mp3LangFromHash(f)) + "'></span>" + j + "</a></li>"
                }
                A += "</ul>";
                u.html(A);
                u.on('click', 'a', this.onPlayRegional.bind(this));
                u.find("li").first().addClass("first");
                // if (s.length > 0) {
                //     var b = s.find(".button_audio");
                //     if (b.length > 0 && b.is(":visible")) {
                //         var k = b.offset();
                //         n = k.left;
                //         l = k.top + 31
                //     }
                // }
                // if (n == -1) {
                    var wo = w.offset();
                    n = wo.left;
                    l = wo.top + 18;
                // }
                var Bo = B.offset();
                var freeSpace = Bo.left + B.width() - n;
                var D = u.width();
                u.css("left", D > freeSpace ? B.width()-D : n-Bo.left)
                freeSpace = Bo.top + B.height() - l;
                var G = u.height();
                u.css("top", G > freeSpace ? B.height()-G : l-Bo.top);
                u.css({
                    height: "auto",
                    overflow: "visible"
                });
                u.show();
                w.css("visibility", "visible")
            } else {
                u.remove()
            }
            this.buttonPlaying.addClass("loading");
            this.playSoundWithAudioPrefix("/mp3/" + C)
        }
    }

    flagCodeFor(a) {
        if (a == "AE") {
            return "us"
        }
        if (a == "BE") {
            return "en"
        }
        return a.toLowerCase()
    }

    is_touch_device() {
        return "ontouchstart" in window || !!(navigator.msMaxTouchPoints);
    }

    onContentClick(){
        if (!window.event.target.closest("#soundFlags, a.audio, .button_audio, #appButtonAudio")) {
            this.hideSoundFlags();
        }
    }
}