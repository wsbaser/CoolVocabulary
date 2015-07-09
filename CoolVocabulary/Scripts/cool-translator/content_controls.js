/**
 * Created by wsbaser on 26.05.2015.
 */
// ==UserScript==
// @name ContentControls
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

function AddTranslationControl() {
    this.translationsList = null;
    this.itemClass = null;
    this.el = null;
    this.selectedTranslationEl = null;
    this.addButtonEl = null;
    this.btnCaptionEl = null;
    this.spinnerEl = null;
};

AddTranslationControl.TRANSL_ITEM_CLASS ='ctr-translItem';

//===== Private ==========

AddTranslationControl.prototype._bindEvents = function() {
    this.addButtonEl.bind('click', this._onAddButtonClick.bind(this));
};

AddTranslationControl.prototype._onAddButtonClick = function() {
    this._showLoading();
    kango.invokeAsyncCallback(ctrContent.vocabulary.config.id + '.getIsAuthenticated', function (isAuthorised) {
        if (isAuthorised)
            this._addTranslation();
        else {
            kango.invokeAsyncCallback(ctrContent.vocabulary.config.id + '.checkAuthentication', function (isAuthorised) {
                if (isAuthorised)
                    this._addTranslation()
                else {
                    this._hideLoading();
                    this._showLoginForm();
                }
            }.bind(this));
        }
    }.bind(this));
};

AddTranslationControl.prototype._showLoginForm = function(){
    Dialog.showLoginForm(ctrContent.vocabulary, function () {
        this._addTranslation();
    }.bind(this));
};

AddTranslationControl.prototype._showLoading = function() {
    this.btnCaptionEl.css('visibility', 'hidden', 'important');
    this.spinnerEl.show();
};

AddTranslationControl.prototype._hideLoading = function() {
    this.btnCaptionEl.css('visibility', 'visible', 'important');
    this.spinnerEl.hide();
};

AddTranslationControl.prototype._addTranslation = function() {
    var inputData = this.translationsList.data;
    var translation = this.selectedTranslationEl.value;
    this._showLoading();
    kango.invokeAsyncCallback(ctrContent.vocabulary.config.id + '.addTranslation',
        inputData,
        translation,
        function (response) {
            response = response || {};
            this._hideLoading();
            if (response.notAuthenticated) {
                console.error('addTranslation: not authorized');
                this._showLoginForm();
            }
            else if (response.error_msg) {
                console.error('addTranslation: ' + response.error_msg);
                this._showAddTranslationError(response.error_msg);
            }
            else {
                this._showTranslationAddedNotification(inputData, translation);
                if(Dialog.isInputDataEqual(this.translationsList.data,inputData))
                    this._highlightAddedTranslation(translation);
                this.setTranslation('');
            }
        }.bind(this));
};

AddTranslationControl.prototype._showTranslationAddedNotification = function(inputData,translation) {
    Dialog.showNotification('Translation added to LinguaLeo',
        inputData.word + ' - ' + translation);
};

AddTranslationControl.prototype._showAddTranslationError = function(error_msg) {
    Dialog.showError(error_msg);
};

AddTranslationControl.prototype._selectTranslationItem = function(e) {
    var targetItemEl = $(e.target).closest('.'+this.itemClass);
    if (!targetItemEl)
        throw new Error('click not inside translation item');
    if(targetItemEl.hasClass('ctr-added'))
        return;
    this.setTranslation(this._getTranslationItemWord(targetItemEl));
    this._forEachTranslationItem(function (i, itemEl) {
        targetItemEl === itemEl ?
            itemEl.addClass('ctr-selected') :
            itemEl.removeClass('ctr-selected');
    });
    e.preventDefault();
    return false;
};

AddTranslationControl.prototype._forEachTranslationItem = function(action) {
    $.each(this.translationsList.rootEl.find('.'+this.itemClass), action);
};

AddTranslationControl.prototype._getTranslationItemWord= function(itemEl) {
    return (this.itemWordClass ? itemEl.getElementsByClassName(this.itemWordClass)[0] : itemEl)
        .textContent.trim();
};

AddTranslationControl.prototype._highlightAddedTranslation = function (translation) {
    this._forEachTranslationItem(
        function (i, itemEl) {
            if (this._getTranslationItemWord(itemEl) === translation) {
                itemEl.removeClass('ctr-selected');
                itemEl.addClass('ctr-added');
            }
        }.bind(this));
};

//===== Public ==========

AddTranslationControl.prototype.createElement = function() {
    if (this.el)
        this.setTranslation('');
    else {
        this.el = $('<div/>',{'class':'ctr-addTransl-block'});
        templatesHelper.getTemplate('contentAddTranslation', function (html) {
            this.el.html(html);
            this.selectedTranslationEl = this.el.getElementsByClassName('ctr-selectedTransl')[0];
            this.addButtonEl = this.el.getElementsByClassName('ctr-addButton')[0];
            this.btnCaptionEl = this.addButtonEl.getElementsByClassName('ctr-btnCaption')[0];
            this.spinnerEl = this.addButtonEl.getElementsByClassName('ctr-spinnerSmall')[0];
            this._bindEvents();
        }.bind(this));
    }
    return this.el;
};

AddTranslationControl.prototype.setTranslation = function(word) {
    this.selectedTranslationEl.value =word?
        Dialog.lastRequestData.word +' - '+word:
        "";
    if(word){
        this.selectedTranslationEl.addClass('ctr-hasValue');
        this.addButtonEl.addClass('ctr-active');
    }
    else {
        this.selectedTranslationEl.removeClass('ctr-hasValue');
        this.addButtonEl.removeClass('ctr-active');
    }
};

AddTranslationControl.prototype.connectTranslationsList = function(translationsList, itemClass,itemWordClass) {
    this.translationsList = translationsList;
    this.itemClass = itemClass;
    this.itemWordClass = itemWordClass;
    this._forEachTranslationItem(function (i, itemEl) {
        itemEl.addClass(AddTranslationControl.TRANSL_ITEM_CLASS);
        itemEl.click(this._selectTranslationItem.bind(this));
    }.bind(this));
};

/***** Login Form *****************************************************************************************************/

function LoginForm(rootElementId) {
    this.el = document.getElementById(rootElementId);
    this.emailEl = this.el.querySelector('input[type="email"]');
    this.passwordEl = this.el.querySelector('input[type="password"]');
    this.buttonEl = this.el.querySelector('input[type="submit"]');
    this.spinnerEl = this.el.getElementsByClassName('ctr-spinner')[0];
    this.errorEl = this.el.getElementsByClassName('ctr-error')[0];
    this.isInitialized = false;
    this._bindEvents();
};

LoginForm.BTN_CAPTION_LOGIN = 'Login';
LoginForm.BTN_CAPTION_WAIT = 'Please wait...';


//===== Private ==========

LoginForm.prototype._bindEvents = function() {
    this.el.find('.ctr-login-form').bind('submit', this._onSubmitForm.bind(this));
    this.el.find('form').bind('click', function (e) {
        e.stopPropagation();
    });
    this.el.bind('click', function () {
        this.hide();
    }.bind(this));
    $(document).bind('keydown', function (e) {
        if (e.keyCode === 27) {
            this.hide();
            cancelEvent(e);
        }
    }.bind(this));
};

LoginForm.prototype._showError = function(error_msg) {
    this.errorEl.innerHTML = error_msg;
    this.spinnerEl.hide();
    this.errorEl.show();
    this.emailEl.focus();
}

LoginForm.prototype._showLoading = function() {
    // remove and add spinner element to restart animation
    var newone = this.spinnerEl.cloneNode(true);
    this.spinnerEl.parentNode.replaceChild(newone, this.spinnerEl);
    this.spinnerEl = newone;
    this.errorEl.hide();
    this.spinnerEl.show();
    this.buttonEl.value = LoginForm.BTN_CAPTION_WAIT;
    this.buttonEl.removeClass('ctr_active');
};

LoginForm.prototype._onSubmitForm = function() {
    this._showLoading();
    kango.invokeAsyncCallback(this.source.config.id + '.loginUser', this.emailEl.value, this.passwordEl.value,
        function (response) {
            if (response.error_msg) {
                this._showError(response.error_msg);
                this._activateSubmitButton();
            } else {
                this.hide();
                this.loginCallback();
            }
        }.bind(this));
    return false;
};

LoginForm.prototype._activateSubmitButton = function() {
    this.buttonEl.value = LoginForm.BTN_CAPTION_LOGIN;
    this.buttonEl.addClass('ctr_active');
};

LoginForm.prototype.init =function(callback) {
    if (this.isInitialized)
        callback();
    else {
        ctrContent.injectStyle('contentLoginStyle', null, function () {
            this.isInitialized = true;
            callback();
        }.bind(this));
    }
};
//===== Public ==========

LoginForm.prototype.show = function (source, loginCallback) {
    this.source = source;
    this.loginCallback = loginCallback;
    this.init(function () {
        this._activateSubmitButton();
        this.el.show()
        this.emailEl.focus();
    }.bind(this));
};

LoginForm.prototype.hide = function(){
    this.el.hide();
};

LoginForm.prototype.isVisible = function() {
    return this.el.is(':visible');
}

/***** NotificationPopup **********************************************************************************************/

function NotificationPopup(rootElementId) {
    this.el = document.getElementById(rootElementId);
    this.titleEl = this.el.getElementsByClassName('ctr-ntfTitle')[0];
    this.bodyEl = this.el.getElementsByClassName('ctr-ntfBody')[0];
    this.el.bind('mouseout', function () {
        if (this.showTimeoutExpired)
            this.hide();
    }.bind(this));
};

NotificationPopup.prototype.show = function(title,bodyHtml) {
    this.el.removeClass('ctr-ntfError');
    this.titleEl.innerHTML = title;
    this.bodyEl.innerHTML = bodyHtml;
    this._hideAfterTimeout(3000);
    this.el.show();
};

NotificationPopup.prototype.showError = function(bodyHtml) {
    this.el.addClass('ctr-ntfError');
    this.titleEl.innerHTML = 'Error';
    this.bodyEl.innerHTML = bodyHtml;
    this._hideAfterTimeout(5000);
    this.el.show();
};

NotificationPopup.prototype.hide = function(){
    this.el.hide();
};

NotificationPopup.prototype._isHovered = function() {
    return (this.el.parentElement.querySelector(':hover') === this.el);
};

NotificationPopup.prototype._hideAfterTimeout = function(timeout) {
    this.showTimeoutExpired = false;
    window.setTimeout(function () {
        this.showTimeoutExpired = true;
        if (!this._isHovered())
            this.hide();
    }.bind(this), timeout);
};


