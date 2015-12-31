window.DEBUG = true;
window.Dialog = null;
/***** ctrContent *****************************************************************************************************/

var ctrContent = {};
ctrContent.isMac = window.navigator.userAgent.toLowerCase().indexOf('macintosh') > -1;
ctrContent.langPair = null;

ctrContent.init = function () {
    ctrContent.bindEventHandlers();
    ctrContent.addInstalledMarker();
    Dialog = TranslationDialogFactory.create();
    Dialog.addEventListener('langPairChanged', ctrContent.onLangPairChanged);
    ctrContent.loadInitializationData(function(data){
        Dialog.setLangPair(data.langPair);
    });
};

ctrContent.addInstalledMarker = function(){
    $('body').append('<div id="ctr_is_installed_'+chrome.runtime.id+'"></div>');
};

/* Save to local storage */
ctrContent.onLangPairChanged = function(langPair) {
    chrome.runtime.sendMessage({
        type: MessageTypes.SaveLangPair,
        langPair: langPair
    });
};

/* Load from local storage */
ctrContent.loadInitializationData = function(callback) {
    chrome.runtime.sendMessage({
        type: MessageTypes.LoadInitializationData
    }, callback);
};

/*
 * @data.word
 * @data.context
 * @data.fromLang
 * @data.toLang
 * */
ctrContent.getSelectedText = function(inputElement) {
    var text;
    if(inputElement){
        text =inputElement.type==='checkbox'?
            '':
            inputElement.value.substring(inputElement.selectionStart, inputElement.selectionEnd);
    }else{
        text = selectionHelper.getSelection().toString();
    }
    return strHelper.trimText(text);
};

ctrContent.showDialogForCurrentSelection = function (inputElement, force) {
    if (inputElement && inputElement.getAttribute && inputElement.getAttribute('type') === 'password')
        return;
    var word = ctrContent.getSelectedText(inputElement);
    if(/^\D+$/g.test(word) && word.split(' ').length<3){
        Dialog.showForExtension(word);
    }else if(force){
        Dialog.showForExtension();        
    }
};

ctrContent.bindEventHandlers = function() {
    document.addEventListener('dblclick', ctrContent.handlers.dblClick);
    document.addEventListener('keydown', ctrContent.handlers.keyDown, true);
    document.addEventListener('keyup', ctrContent.handlers.keyUp);
};

/***** Handlers *******************************************************************************************************/

ctrContent.handlers = {};

ctrContent.handlers.dblClick = function (event) {
    if(event.ctrlKey || event.shiftKey || event.altKey || event.metaKey){
        // . do not show dialog if any command key pressed
        return;
    }
    var inputElement = null;
    if (typeof event.target.tagName !== 'undefined' &&
        (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea')) {
        inputElement = event.target;
    }
    ctrContent.showDialogForCurrentSelection(inputElement);
    return false;
};

ctrContent.handlers.keyUp = function(e) {
    if(!Dialog || !Dialog.isActive)
        return;
    if (e.keyCode == 17 && Dialog.sourceWithActiveLink !== Dialog.activeSource)
        Dialog.selectSource(Dialog.sourceWithActiveLink);
};

ctrContent.handlers.keyDown = function(e) {
    // . shift for Mac
    // . ctrl for PC
    var isCommandKeyPressed = ((ctrContent.isMac && e.shiftKey && !e.ctrlKey ) || 
        (!ctrContent.isMac && e.ctrlKey && !e.shiftKey)) && !e.altKey && !e.metaKey;

    if (Dialog && Dialog.isActive && !Dialog.loginForm.isVisible()) {
        // . Dialog is Visible
        var langSelectorIsActive = Dialog.sourceLangSelector.isActive||Dialog.targetLangSelector.isActive;
        if (e.keyCode === 27 && !langSelectorIsActive) {                    // Esc + language selectors are't active
            Dialog.hide();
            return  cancelEvent(e);
        }
        if(Dialog.isInputFocused() || langSelectorIsActive){
            if (isCommandKeyPressed) {
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
            if (isCommandKeyPressed) {
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

        if (isCommandKeyPressed && e.keyCode === 32) {      // Ctrl + Space
            Dialog.focusInput();
            return cancelEvent(e);
        }
    }
    else {
        // Dialog is Hidden
        if (isCommandKeyPressed && e.keyCode === 32) {      // Ctrl + Space
            if(ctrContent.dataFromSite &&
                $(ctrContent.dataFromSite.attachBlockSelector).length)
                ctrContent.showDialogForSite();
            else
                ctrContent.showDialogForCurrentSelection(null,true);
            return cancelEvent(e);
        }
    }
};

ctrContent.dataFromSite = null;
ctrContent.showDialogForSite = function(word){
    Dialog.showForSite(ctrContent.dataFromSite.langPair, 
        ctrContent.dataFromSite.attachBlockSelector, 
        word, 
        ctrContent.dataFromSite.bookId, 
        ctrContent.dataFromSite.user);
};

ctrContent.initSiteDialog = function(langPair, attachBlockSelector, bookId, user){
    ctrContent.dataFromSite = {
        langPair: langPair,
        attachBlockSelector: attachBlockSelector,
        bookId: bookId,
        user: user
    };
    var attachBlockEl = $(attachBlockSelector);
    attachBlockEl.on('submit', function(event){
        ctrContent.showDialogForSite(attachBlockEl.find('input').val());
        return false;
    });
};

//======================================================================================================================

ctrContent.init();

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch(message.type){
        case MessageTypes.InitSiteDialog:
            ctrContent.initSiteDialog(message.langPair, message.attachBlockSelector, message.bookId, message.user);
            break;
        case MessageTypes.OAuthSuccess:
            Dialog.vocabulary.authenticate(message.user);
            break;
        default:
            console.error('Unknown message type:' + message.type);
            break;
    }
});