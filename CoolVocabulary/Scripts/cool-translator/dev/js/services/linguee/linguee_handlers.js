function LingueeHandlers(){
    var gAudio = null ;
    var gHideSoundFlagsTimer = false;
    var gIsOverSound = false;
    function hideSoundFlags() {
        if (!gIsOverSound) {
            $("#soundFlags").slideUp();
            buttonPlaying.removeClass("playing").removeClass("loading");
        }
    }
    function clearHideSoundFlagsTimer() {
        if (gHideSoundFlagsTimer) {
            clearTimeout(gHideSoundFlagsTimer)
        }
    }
    function startHideSoundFlagsTimer() {
        clearHideSoundFlagsTimer();
        gHideSoundFlagsTimer = setTimeout(hideSoundFlags, 2000)
    }
    function outSound() {
        if (gAudio == null ) {
            startHideSoundFlagsTimer()
        }
        gIsOverSound = false
    }
    function overSound() {
        gIsOverSound = true;
        clearHideSoundFlagsTimer()
    }
    function clearAudio(a) {
        gAudio = null ;
        $("#soundFlags li.playing").removeClass("playing");
        if (soundCurrentlyPlaying) {
            soundCurrentlyPlaying.parent().removeClass("playing")
        }
        buttonPlaying.removeClass("playing").removeClass("loading");
        $("#audio-player").remove();
        if (a) {
            startHideSoundFlagsTimer()
        }
    }
    function audioPlayingStarted() {
        soundCurrentlyPlaying.parent().addClass("playing")
    }
    function audioPlayingDidFinish() {
        clearAudio(true)
    }
    function audioPlayingError() {
        clearAudio(true)
    }
    function playSoundWithAudioPrefix(a) {
        a = 'http://linguee.com'+a;
        $("#audio-player").remove();
        $("body").prepend($("<audio id='audio-player'><source src='" + a + ".mp3' type='audio/mpeg'><source src='" + a + ".ogg' type='audio/ogg'></audio>"));
        gAudio = $("#audio-player").get(0);
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
        gAudio.addEventListener('ended', audioPlayingDidFinish);
        gAudio.addEventListener('playing', audioPlayingStarted);
        gAudio.addEventListener('error', audioPlayingError);
        gAudio.play()
    }
    var preferredMp3Langs = new Array();
    var buttonPlaying = $();
    var buttonPlayingTime = 0;
    function mp3LangFromHash(a) {
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

    function play(f, g, b) {
        var e = $(f);
        clearHideSoundFlagsTimer();
        $("#soundFlags").stop(true, false);
        if (gAudio) {
            clearAudio(false)
        }
        e.removeClass("playing");
        soundCurrentlyPlaying = e;
        playSoundWithAudioPrefix("/mp3/" + b);
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

    function soundFlags() {
        var a = $("#soundFlags");
        if (a.length == 0) {
            a = $("<div id='soundFlags'>");
            $("#linguee_article").append(a);
            if (!is_touch_device()) {
                a.mouseenter(function() {
                    overSound()
                });
                a.mouseleave(function() {
                    outSound()
                })
            }
        }
        return a
    }

    function onPlayRegional(){
        play(this, 0, this.dataset.soundurl);
    }

    function playSound(r, h, q, g, m, f, j) {
        var w = $(r);
        var a = $(r).hasClass("playing");
        clearHideSoundFlagsTimer();
        $("#soundFlags").stop(true, false);
        if (buttonPlayingTime == 0 || (new Date().getTime() - buttonPlayingTime) > 1000) {
            buttonPlaying = $();
        }
        if (gAudio) {
            clearAudio(false);
            hideSoundFlags();
            buttonPlaying = $();
            $(".button_audio.playing").removeClass("playing")
        }
        if (!a) {
            var u = soundFlags();
            var C = h;// preferredHash(h, g, f);
            var d = mp3LangFromHash(h);
            soundCurrentlyPlaying = w;
            if (arguments.length >= 3 && (d == "PT_PT" || d == "PT_BR" || d == "EN_US" || d == "EN_UK")) {
                //var s = w.closest(".translation.expanded");
                var B = $("#linguee_article");
                var n = -1;
                var l = -1;
                var z = "flagsmall";
                var A = "<ul class='soundFlagsList'><li" + (C == h ? " class='playing'" : "") + "><a data-soundurl='" + h + "'><span class='loudspeaker'></span><span class='" + z + " " + z + "_" + flagCodeFor(mp3LangFromHash(h)) + "'></span>" + q + "</a></li>";
                if (arguments.length >= 5) {
                    A += "<li" + (C == g ? " class='playing'" : "") + "><a data-soundurl='" + g + "'><span class='loudspeaker'></span><span class='" + z + " " + z + "_" + flagCodeFor(mp3LangFromHash(g)) + "'></span>" + m + "</a></li>"
                }
                if (arguments.length >= 7) {
                    A += "<li" + (C == f ? " class='playing'" : "") + "><a data-soundurl='" + f + "'><span class='loudspeaker'></span><span class='" + z + " " + z + "_" + flagCodeFor(mp3LangFromHash(f)) + "'></span>" + j + "</a></li>"
                }
                A += "</ul>";
                u.html(A);
                u.on('click', 'a', onPlayRegional);
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
            buttonPlaying.addClass("loading");
            playSoundWithAudioPrefix("/mp3/" + C)
        }
    }

    function flagCodeFor(a) {
        if (a == "AE") {
            return "us"
        }
        if (a == "BE") {
            return "en"
        }
        return a.toLowerCase()
    }

    function is_touch_device() {
        return "ontouchstart" in window || !!(navigator.msMaxTouchPoints);
    }

    function onContentClick(){
        if (!window.event.target.closest("#soundFlags, a.audio, .button_audio, #appButtonAudio")) {
            hideSoundFlags();
        }
    }

    return {
        playSound: playSound,
        onContentClick: onContentClick
    };
}

var LingueeHandlers = new LingueeHandlers();