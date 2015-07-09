// ==UserScript==
// @name CoolTranslatorContent
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

/**
 * @requires utils.js
 * @requires content_utils.js
 */

/***** ctrContent *****************************************************************************************************/

var ctrContent = {};
ctrContent.config = null;
ctrContent.isMac = window.navigator.userAgent.toLowerCase().indexOf('macintosh') > -1;
ctrContent.options = null;
ctrContent.currentLocale = null;
ctrContent.lastTextSentForTranslation = null;
ctrContent.sources = {};
ctrContent.allSupportedLangs = [];

//===== Init ===========================================================================================================

ctrContent.initSources = function() {
    var all = [abbyContent, llContent, googleContent, tfdContent];
    all.sort(function (a, b) {
        return a.config.priority > b.config.priority ? -1 : 1;
    });
    $(all).each(function(i, source) {
        ctrContent.sources[source.config.id] = source;
        source.init();
        $(source.config.sourceLanguages.concat(source.config.targetLanguages)).each(function (i, lang) {
            if (ctrContent.allSupportedLangs.indexOf(lang) === -1)
                ctrContent.allSupportedLangs.push(lang);
        });
    });
};

ctrContent.init = function () {
    ctrContent.config = new CoolTranslatorConfig(true, function () {
        ctrContent.vocabulary = llContent;
        ctrContent.bindEventHandlers();
        ctrContent.initSources();
        ctrContent.getCurrentLocale(function(){
            Dialog.init();
        });
    });
};

ctrContent.getCurrentLocale = function (callback) {
    kango.invokeAsync('cooltranslator.getCurrentLocale', function (lang) {
        ctrContent.currentLocale = lang;
        callback();
    });
};

ctrContent.canPlayMp3 = function () {
    try {
        if (browserDetector.isSafari()) {
            var audioElement = $('<audio/>');
            var canPlay = audioElement[0].canPlayType("audio/mpeg");
            return canPlay == 'maybe' || canPlay == 'probably';
        }
    } catch (e) {
        return false;
    }
}

/*
 * @data.word
 * @data.context
 * @data.fromLang
 * @data.toLang
 * */
ctrContent.showDialog = function (word) {
    var f = function () {
        if (Dialog.isActive) {
            Dialog.inputEl.value = word;
            Dialog.updateSourcesContent();
        }
        else {
            Dialog.selectionBackup = selectionHelper.saveSelection();
            Dialog.show(word);
            Dialog.updateSourcesContent();
        }
    };
    if (Dialog.firstShow) {
        Dialog.firstShow = false;
        ctrContent.injectStyles(function () {
            Dialog.el.removeAttribute('style');
            f();
        });
    }
    else
        f();
};

ctrContent.getSelectedText = function(inputElement) {
    var text = inputElement ?
        inputElement.value.substring(inputElement.selectionStart, inputElement.selectionEnd) :
        selectionHelper.getSelection().toString();
    return strHelper.trimText(text);
};

ctrContent.showDialogForCurrentSelection = function (inputElement) {
    if (inputElement && inputElement.getAttribute && inputElement.getAttribute('type') === 'password')
        return;
    ctrContent.showDialog(ctrContent.getSelectedText(inputElement));
};

ctrContent.bindEventHandlers = function () {
    $(window).bind('resize', Dialog.hide);
    $(document).bind('dblclick', ctrContent.handlers.dblClick)
        .bind('keydown', ctrContent.handlers.keyDown, true)
        .bind('keyup', ctrContent.handlers.keyUp)
        .bind('mousedown', function () {
            if (Dialog.hide())
                return false;
        });
};

ctrContent.injectStyle = function (filename,templatesDir,callback) {
    templatesHelper.getTemplate(filename, templatesDir, function (code) {
        cssHelper.addCss(code);
        if(callback)
            callback()
    });
};

ctrContent.injectStyles = function (callback) {
    ctrContent.injectStyle('contentStyle',null, function () {
        var imagesPath = ctrContent.config.path.images;
        var css = "#ctr_dialog .ctr-source-icon {" +
            "background-image:url('" + imagesPath + "/sprites.png') !important" +
            "}";
        css += "#ctr_dialog .ctr-flag-icon {" +
        "background-image:url('" + imagesPath + "/flags.png') !important" +
        "}";
        css += "#ctr_dialog .ctr-addIcon {" +
        "background: url('" + imagesPath + "/add.png') center no-repeat !important" +
        "}";
        cssHelper.addCss(css);
        ctrContent.stylesInjected = true;
        callback();
    });
};

ctrContent.openSettings = function () {
    kango.invokeAsync('kango.ui.optionsPage.open');
};

/***** Handlers *******************************************************************************************************/
ctrContent.handlers = {};

ctrContent.handlers.dblClick = function (event) {
    var inputElement = null;
    if (typeof event.target.tagName !== 'undefined' &&
        (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea')) {
        inputElement = event.target;
    }
    ctrContent.showDialogForCurrentSelection(inputElement);
    return false;
};

ctrContent.handlers.keyUp = function(e) {
    if (e.keyCode == 17 && Dialog.sourceWithActiveLink !== Dialog.activeSource)
        Dialog.selectSource(Dialog.sourceWithActiveLink);
};

ctrContent.handlers.keyDown = function(e) {
    if (Dialog.isActive) {
        // . Dialog is Visible
        var langSelectorIsActive = Dialog.sourceLangSelector.isActive||Dialog.targetLangSelector.isActive;
        if (e.keyCode === 27 && !langSelectorIsActive && !Dialog.loginForm.isVisible()) {                    // Esc + language selectors are't active
            Dialog.hide();
            return  cancelEvent(e);
        }
        if(Dialog.isInputFocuces() || langSelectorIsActive){
            if (e.ctrlKey && !e.shiftKey && !e.altKey) {
                if (e.keyCode === 13) {                                     // Ctrl + Enter
                    Dialog.langSwitcher.switch(Dialog.focusInput());
                    return cancelEvent(e);
                }
                if (e.keyCode === 37) {                                     // Ctrl + Left
                    Dialog.targetLangSelector.hideList();
                    Dialog.sourceLangSelector._showList();
                    return cancelEvent(e);
                }
                if (e.keyCode === 39) {                                      // Ctrl + Right
                    Dialog.sourceLangSelector.hideList();
                    Dialog.targetLangSelector._showList();
                    return cancelEvent(e);
                }
            }
        }
        else {
            if (e.ctrlKey && !e.shiftKey && !e.altKey) {
                if (e.keyCode === 37) {                                 // Ctrl + Left
                    Dialog.selectPrevSource();
                    return cancelEvent(e);
                }
                if (e.keyCode === 39) {                                 // Ctrl + Right
                    Dialog.selectNextSource();
                    return cancelEvent(e);
                }
            }
            if (Dialog.activeSource) {
                if (e.keyCode === 37) {                                 // Left
                    Dialog.activeSource.selectPrevNavigationItem();
                    return cancelEvent(e);
                }
                if (e.keyCode === 39) {                                 // Right
                    Dialog.activeSource.selectNextNavigationItem();
                    return cancelEvent(e);
                }
            }
        }

        if (e.ctrlKey && e.keyCode === 32) {      // Ctrl + Space
            Dialog.focusInput();
            return cancelEvent(e);
        }
    }
    else {
        // Dialog is Hidden
        if (e.ctrlKey && e.keyCode === 32) {      // Ctrl + Space
            ctrContent.showDialog();
            return cancelEvent(e);
        }
    }
};
//======================================================================================================================

ctrContent.init();