'use strict';

import MessageTypes from '../message-types';
import ServiceProvider from './service-provider';

export default class CTContent {
    constructor() {
        this.isMac = window.navigator.userAgent.toLowerCase().indexOf('macintosh') > -1;
        this.dataFromSite = null;
        this.serviceProvider = new ServiceProvider();
        this.dialog = this.serviceProvider.getDialog();
    }

    init() {
        let self = this;
        this._addInstalledMarker();
        this._loadInitializationData(function(data) {
            self.dialog.setLangPair(data.langPair);
            self.dialog.addLangPairChangedListener(this._onLangPairChanged);
        });
        this._listenBackground();
        this._bindEventHandlers();
    }

    _listenBackground() {
        chrome.runtime.onMessage.addListener(this._onMessage.bind(this));
    }

    _onMessage(message, sender, sendResponse) {
        switch (message.type) {
            case MessageTypes.InitSiteDialog:
                this.initSiteDialog(message.langPair, message.attachBlockSelector, message.bookId);
                break;
            case MessageTypes.OAuthSuccess:
                let vocabulary = this.serviceProvider.getVocabulary();
                vocabulary.authenticate(message.user);
                break;
        }
    }

    _addInstalledMarker() {
        $('body').append('<div id="ctr_is_installed_' + chrome.runtime.id + '"></div>');
    }

    _onLangPairChanged(langPair) {
        chrome.runtime.sendMessage({
            type: MessageTypes.SaveLangPair,
            langPair: langPair
        });
    }

    /* Load from local storage */
    _loadInitializationData(callback) {
        chrome.runtime.sendMessage({
            type: MessageTypes.LoadInitializationData
        }, callback);
    }

    _getSelectedText(inputElement) {
        let text;
        if (inputElement) {
            text = inputElement.type === 'checkbox' ?
                '' :
                inputElement.value.substring(inputElement.selectionStart, inputElement.selectionEnd);
        } else {
            text = selectionHelper.getSelection().toString();
        }
        return strHelper.trimText(text);
    }

    _showDialogForCurrentSelection(inputElement, force) {
        if (inputElement && inputElement.getAttribute && inputElement.getAttribute('type') === 'password')
            return;
        let word = this._getSelectedText(inputElement);
        if (/^\D+$/g.test(word) && word.split(' ').length <= 3) {
            Dialog.showForExtension(word);
        } else if (force) {
            Dialog.showForExtension();
        }
    };

    _bindEventHandlers() {
        document.addEventListener('dblclick', this.dblClick.bind(this));
        document.addEventListener('keydown', this.keyDown.bind(this), true);
        document.addEventListener('keyup', this.keyUp.bind(this));
    }

    //***** HANDLERS *******************************************************************************************************

    dblClick(event) {
        if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
            // . do not show dialog if any command key pressed
            return;
        }
        let inputElement = null;
        if (typeof event.target.tagName !== 'undefined' &&
            (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea')) {
            inputElement = event.target;
        }
        this._showDialogForCurrentSelection(inputElement);
        return false;
    }

    keyUp(e) {
        if (!Dialog || !Dialog.isActive)
            return;
        if (e.keyCode == 17 && Dialog.sourceWithActiveLink !== Dialog.activeSource)
            Dialog.activateSourceWithActiveLink();
    }

    keyDown(e) {
        function cancelEvent(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // . shift for Mac
        // . ctrl for PC
        let isCommandKeyPressed = ((this.isMac && e.shiftKey && !e.ctrlKey) ||
            (!this.isMac && e.ctrlKey && !e.shiftKey)) && !e.altKey && !e.metaKey;

        if (Dialog && Dialog.isActive && !Dialog.loginForm.isVisible()) {
            // . Dialog is Visible
            let langSelectorIsActive = Dialog.sourceLangSelector.isActive || Dialog.targetLangSelector.isActive;
            if (e.keyCode === 27 && !langSelectorIsActive) { // Esc + language selectors are't active
                Dialog.hide();
                return cancelEvent(e);
            }
            if (Dialog.isInputFocused() || langSelectorIsActive) {
                if (isCommandKeyPressed) {
                    if (e.keyCode === 13) { // Ctrl + Enter
                        Dialog.langSwitcher.switch(Dialog.focusInput.bind(Dialog));
                        return cancelEvent(e);
                    }
                    if (e.keyCode === 37) { // Ctrl + Left
                        Dialog.targetLangSelector.hideList();
                        Dialog.sourceLangSelector._showList();
                        return cancelEvent(e);
                    }
                    if (e.keyCode === 39) { // Ctrl + Right
                        Dialog.sourceLangSelector.hideList();
                        Dialog.targetLangSelector._showList();
                        return cancelEvent(e);
                    }
                }
            } else {
                if (isCommandKeyPressed) {
                    if (e.keyCode === 37) { // Ctrl + Left
                        Dialog.selectPrevSource();
                        return cancelEvent(e);
                    }
                    if (e.keyCode === 39) { // Ctrl + Right
                        Dialog.selectNextSource();
                        return cancelEvent(e);
                    }
                }
                if (Dialog.activeSource) {
                    if (e.keyCode === 37) { // Left
                        Dialog.activeSource.selectPrevNavigationItem();
                        return cancelEvent(e);
                    }
                    if (e.keyCode === 39) { // Right
                        Dialog.activeSource.selectNextNavigationItem();
                        return cancelEvent(e);
                    }
                }
            }

            if (isCommandKeyPressed && e.keyCode === 32) { // Ctrl + Space
                Dialog.focusInput();
                return cancelEvent(e);
            }
        } else {
            // Dialog is Hidden
            if (isCommandKeyPressed && e.keyCode === 32) { // Ctrl + Space
                if (this.dataFromSite &&
                    $(this.dataFromSite.attachBlockSelector).length)
                    this.showDialogForSite();
                else
                    this._showDialogForCurrentSelection(null, true);
                return cancelEvent(e);
            }
        }
    }

    //***** PUBLIC ********************************************************************************************************

    showDialogForSite(word) {
        this.dialog.showForSite(this.dataFromSite.langPair,
            this.dataFromSite.attachBlockSelector,
            word,
            this.dataFromSite.bookId);
    }

    initSiteDialog(langPair, attachBlockSelector, bookId) {
        let self = this;
        this.dataFromSite = {
            langPair: langPair,
            attachBlockSelector: attachBlockSelector,
            bookId: bookId
        };
        let attachBlockEl = $(attachBlockSelector);
        attachBlockEl.on('submit', function(event) {
            self.showDialogForSite(attachBlockEl.find('input').val());
            return false;
        });
    }
}