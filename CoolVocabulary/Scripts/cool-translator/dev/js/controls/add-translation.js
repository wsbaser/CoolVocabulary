'use strict';

import '../../styles/add-translation.styl';
import Reactor from 'reactor';
import Vocabulary from '../services/vocabulary';


const TRANSL_ITEM_CLASS = 'ctr-translItem';
const TEMPLATE =
'<div class="ctr-hSplitter"></div>\
<table>\
    <tbody>\
        <tr>\
            <td class="ctr-transl-col">\
                <input class="ctr-selectedTransl" readonly type="textbox" placeholder="Select translation">\
            </td>\
            <td class="ctr-button-col">\
                <a class="ctr-button">\
                    <span class="ctr-caption">\
                        <span id="ctr_addCaption" style="display: none !important">\
                            <span class="ctr-addIcon"></span>\
                            &nbsp;Add\
                        </span>\
                        <span id="ctr_loginCaption">\
                            Login\
                            <img class="ctr-vocabularyIcon" src=""/>\
                        </span>\
                    </span>\
                    <div class="ctr-spinnerSmall">\
                      <div></div>\
                      <div></div>\
                      <div></div>\
                    </div>\
                </a>\
            </td>\
            <td class="ctr-user-col" style="display: none !important">\
                <a target="_blank">\
                    <i class="ctr-vocabularyIcon"/>\
                    <span id="ctr_userName"></span>\
                </a>\
            </td>\
        </tr>\
    </tbody>\
</table>';

export default class AddTranslation{
    constructor(vocabulary, translationItemSelector, translationWordSelector) {
        this.vocabulary = vocabulary;
        this.translationItemSelector = translationItemSelector;
        this.translationWordSelector = translationWordSelector;

        this.translationsList = null;
        this.isAuthenticated = false;
        this._createEl();
        this.vocabulary.addEventListener(Vocabulary.CHECK_AUTH_START, this._onCheckAuthStart.bind(this));
        this.vocabulary.addEventListener(Vocabulary.CHECK_AUTH_END, this._onCheckAuthEnd.bind(this));

        this.reactor = new Reactor();
        this.reactor.registerEvent(AddTranslation.SHOW_LOGIN);
        this.reactor.registerEvent(AddTranslation.SHOW_SELECT_BOOK);
        this.reactor.registerEvent(AddTranslation.SHOW_NOTIFICATION);
        this.reactor.registerEvent(AddTranslation.SHOW_ERROR);
    }

    //***** STATIC ****************************************************************************************************

    static get SHOW_LOGIN(){
        return 'showlogin';
    }

    static get SHOW_SELECT_BOOK(){
        return 'showselectbook';
    }

    static get SHOW_NOTIFICATION(){
        return 'shownotification';
    }

    static get SHOW_ERROR(){
        return 'showerror';
    }

    //***** PRIVATE ****************************************************************************************************
    _onCheckAuthStart() {
        this._showLoading();
        this.userColEl.hide();
    }

    _onCheckAuthEnd() {
        this._hideLoading();
        this.isAuthenticated = !!this.vocabulary.user;
        if (this.isAuthenticated) {
            this.userNameEl.text(this.vocabulary.user.name);
            this.userColEl.showImportant();
            this.loginCaptionEl.hide();
            this.addCaptionEl.showImportant();
        } else {
            this.userColEl.hide();
            this.loginCaptionEl.showImportant();
            this.addCaptionEl.hide();
        }
    }

    _createEl() {
        let self = this;
        this.el = $('<div/>', {
            'class': 'ctr-addTransl-block'
        });
        this.el.html(TEMPLATE);
        this.selectedTranslationEl = this.el.find('.ctr-selectedTransl');
        this.buttonEl = this.el.find('.ctr-button');
        this.btnCaptionEl = this.buttonEl.find('.ctr-caption');
        this.spinnerEl = this.buttonEl.find('.ctr-spinnerSmall');
        this.loginCaptionEl = this.buttonEl.find('#ctr_loginCaption');
        this.addCaptionEl = this.buttonEl.find('#ctr_addCaption');
        this.userColEl = this.el.find('.ctr-user-col');
        this.userNameEl = this.el.find('#ctr_userName');
        this.userColEl.find('a').attr('href', this.vocabulary.config.path.vocabulary);
    }

    _bindEvents() {
        let self = this;
        this.buttonEl.bind('click', this._onButtonClick.bind(this));
    }

    _showLoginForm(callback) {
        this.reactor.dispatchEvent(AddTranslation.SHOW_LOGIN, callback);
    }

    _showLoading() {
        this.btnCaptionEl.css('visibility', 'hidden');
        this.spinnerEl.show();
    }

    _hideLoading() {
        this.btnCaptionEl.css('visibility', 'visible')
        this.spinnerEl.hide();
    }

    _addTranslation() {
        let self = this;
        let inputData = self.translationsList.data;
        let translation = self.selectedTranslationEl.val();
        this.reactor.dispatchEvent(AddTranslation.SHOW_SELECT_BOOK, inputData, translation, function() {
            self._showLoading();
            self.vocabulary.addTranslation(inputData, translation, self.translationsList.serviceId, function(promise) {
                promise.done(function(response) {
                    response = response || {};
                    self._hideLoading();
                    self._showTranslationAddedNotification(inputData, translation);
                    if (isInputDataEqual(self.translationsList.data, inputData))
                        self._highlightAddedTranslation(translation);
                    self.setTranslation('');
                }).fail(function(response) {
                    self._hideLoading();
                    if (response.notAuthenticated)
                        self._showLoginForm(self._addTranslation.bind(self));
                    else
                        self._showAddTranslationError(response);
                });
            });
        });
    }

    _showTranslationAddedNotification(inputData, translation) {
        this.reactor.dispatchEvent(AddTranslation.SHOW_NOTIFICATION, 
            'Translation added',
            inputData.word + ' - ' + translation);
    }

    _showAddTranslationError(error_msg) {
        this.reactor.dispatchEvent(AddTranslation.SHOW_ERROR, error_msg);
    }

    _selectTranslationItem(e) {
        let targetItemEl = $(e.target).closest(this.translationItemSelector);
        if (!targetItemEl[0])
            throw new Error('click not inside translation item');
        if (targetItemEl.hasClass('ctr-added'))
            return;
        this.setTranslation(this._getTranslationItemWord(targetItemEl));
        this._forEachTranslationItem(function(i, itemEl) {
            itemEl = $(itemEl);
            targetItemEl[0] === itemEl[0] ?
                itemEl.addClass('ctr-selected') :
                itemEl.removeClass('ctr-selected');
        });
        e.preventDefault();
        return false;
    }

    _forEachTranslationItem(action) {
        $.each(this.translationsList.rootEl.find(this.translationItemSelector), action);
    }

    _getTranslationItemWord(itemEl) {
        return (this.translationWordSelector ? itemEl.find(this.translationWordSelector) : itemEl)
            .text().trim();
    }

    _highlightAddedTranslation(translation) {
        this._forEachTranslationItem(
            function(i, itemEl) {
                itemEl = $(itemEl);
                if (this._getTranslationItemWord(itemEl) === translation) {
                    itemEl.removeClass('ctr-selected');
                    itemEl.addClass('ctr-added');
                }
            }.bind(this));
    }

    //***** HANDLERS **************************************************************************************************

    _onButtonClick() {
        if (!this.buttonEl.hasClass('ctr-active')) {
            return;
        }
        if (this.isAuthenticated)
            this._addTranslation()
        else
            this._showLoginForm();
    }

    //***** PUBLIC ***************************************************************************************************

    init(translationsList) {
        this.translationsList = translationsList;
        this.setTranslation('');
        let self = this;
        this._forEachTranslationItem(function(i, itemEl) {
            itemEl = $(itemEl);
            itemEl.addClass(TRANSL_ITEM_CLASS);
            itemEl.on('click', self._selectTranslationItem.bind(self));
        });
        this._bindEvents();
        //this.checkAuthentication();
    }

    setTranslation(word) {
        this.selectedTranslationEl.val(word);
        if (word) {
            this.selectedTranslationEl.addClass('ctr-hasValue');
            this.buttonEl.addClass('ctr-active');
        } else {
            this.selectedTranslationEl.removeClass('ctr-hasValue');
            this.buttonEl.removeClass('ctr-active');
        }
    }

    addEventListener(eventType, handler){
        this.reactor.addEventListener(eventType, handler);
    }
    
}