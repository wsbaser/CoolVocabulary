window.Dialog = null;
/***** ctrContent *****************************************************************************************************/

var ctrContent = {};
ctrContent.isMac = window.navigator.userAgent.toLowerCase().indexOf('macintosh') > -1;

ctrContent.init = function () {
    ctrContent.bindEventHandlers();
    ctrContent.loadInitializationData(function(data){
        Dialog = TranslationDialogFactory.createExtensionDialog(data.langPair);
        Dialog.addEventListener('langPairChanged', ctrContent.onLangPairChanged);
    });
};

/* Save to local storage */
ctrContent.onLangPairChanged = function(event, langPair) {
  chrome.runtime.sendMessage({
      type: MessageTypes.SaveLangPair,
      langPair: langPair
    });
};

/* Load from local storage */
ctrContent.loadInitializationData = function(callback) {
    chrome.runtime.sendMessage({type: MessageTypes.LoadInitializationData}, callback);
};

/*
 * @data.word
 * @data.context
 * @data.fromLang
 * @data.toLang
 * */
ctrContent.getSelectedText = function(inputElement) {
    var text = inputElement ?
        inputElement.value.substring(inputElement.selectionStart, inputElement.selectionEnd) :
        selectionHelper.getSelection().toString();
    return strHelper.trimText(text);
};

ctrContent.showDialog = function(word){
    if(Dialog!=null)
        Dialog.show(word);
};

ctrContent.showDialogForCurrentSelection = function (inputElement) {
    if (inputElement && inputElement.getAttribute && inputElement.getAttribute('type') === 'password')
        return;
    var word = ctrContent.getSelectedText(inputElement);
    ctrContent.showDialog(word);
};

ctrContent.bindEventHandlers = function() {
    document.addEventListener('ondblclick', ctrContent.handlers.dblClick);
    document.addEventListener('keydown', ctrContent.handlers.keyDown, true);
    document.addEventListener('keyup', ctrContent.handlers.keyUp);
    document.addEventListener('mousedown', ctrContent.handlers.mousedown);
};

/***** Handlers *******************************************************************************************************/

ctrContent.handlers = {};

ctrContent.handlers.mousedown = function(e){
    if (Dialog &&
        !$.contains(Dialog.el[0], e.target) &&
         Dialog.hide())
        return false;
};

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
    if(!Dialog || !Dialog.isActive)
        return;
    if (e.keyCode == 17 && Dialog.sourceWithActiveLink !== Dialog.activeSource)
        Dialog.selectSource(Dialog.sourceWithActiveLink);
};

ctrContent.handlers.keyDown = function(e) {
    if (Dialog && Dialog.isActive && !Dialog.loginForm.isVisible()) {
        // . Dialog is Visible
        var langSelectorIsActive = Dialog.sourceLangSelector.isActive||Dialog.targetLangSelector.isActive;
        if (e.keyCode === 27 && !langSelectorIsActive) {                    // Esc + language selectors are't active
            Dialog.hide();
            return  cancelEvent(e);
        }
        if(Dialog.isInputFocused() || langSelectorIsActive){
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

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch(message.type){
        case MessageTypes.DialogInjected:
            // Dialog = TranslationDialogFactory.createExtensionDialog();
            // Dialog.show(message.word);
            break;
        default:
            console.error('Unknown message type:'+message.type);
            break;
    }
});