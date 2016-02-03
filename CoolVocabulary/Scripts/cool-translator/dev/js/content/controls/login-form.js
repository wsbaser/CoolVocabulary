'use strict';

const BTN_CAPTION_LOGIN = 'Sing In';
const BTN_CAPTION_WAIT = 'Please wait...';
const TEMPLATE =
    '<div class="popover">\
    <div id="ctr_login_wrap">\
        <form class="ctr-login-form cf">\
            <ul>\
                <li>\
                  <div class="login-wrap"><label for="usermail">Email</label>\
                  <input type="email" required="" name="usermail"></div>\
                  <div class="password-wrap"><label for="password">Password</label>\
                  <input type="password" required="" name="password"></div>\
                </li>\
                <li style="width:100% !important;height:25px !important;overflow:hidden !important;">\
                    <div class="ctr-error"></div>\
                    <div class="ctr-spinner">\
                      <div></div>\
                      <div></div>\
                      <div></div>\
                      <div></div>\
                    </div>\
                </li>\
                <li style="text-align:center !important; width:100% !important;">\
                <input type="submit" value="Sign In" class="blue-button blurred"/></li>\
                <li class="or-container">\
                  <hr class="or-hr">\
                  <div id="or">or</div>\
                </li>\
                <li class="oauth-buttons blurred">\
                  <button type="submit" value="Google" name="provider" class="preferred-login google-login">\
                      <div class="icon-container"><span class="icon" style=""></span></div>\
                      <div class="text"><span>Google</span></div>\
                      <br class="cbt">\
                  </button>\
                </li>\
                <li class="ctr-signUp-wrap">\
                    Don\'t have an account?\
                    <a class="ctr-signUp" target="_blank" href="http://coolvocabulary.com/account/Register">Sing Up</a>\
                </li>\
            </ul>\
        </form>\
    </div>\
</div>';

export default class LoginForm {
    constructor(containerElementSelector) {
        this.containerElementSelector = containerElementSelector;
    }

    _createEl() {
        this.containerEl = $(this.containerElementSelector);
        this.containerEl.html(TEMPLATE);
        this.popoverEl = this.containerEl.children().first();
        this.el = this.popoverEl.children().first();
        this.emailEl = this.el.find('input[type="email"]');
        this.passwordEl = this.el.find('input[type="password"]');
        this.buttonEl = this.el.find('input[type="submit"]');
        this.spinnerEl = this.el.find('.ctr-spinner');
        this.errorEl = this.el.find('.ctr-error');
    }

    _bindEvents() {
        let self = this;
        this.el.find('.ctr-login-form').on('submit', this._onSubmitForm.bind(this));
        this.el.find('.google-login').on('click', this._onOAuthLogin.bind(this));

        this.containerEl.bind('click', function() {
            self.hide();
        });
        this.el.on('click', function(e) {
            e.stopPropagation();
        });
        $(document).bind('keydown', function(e) {
            if (e.keyCode === 27) {
                self.hide();
                cancelEvent(e);
            }
        });
    }

    _onOAuthLogin() {
        let self = this;
        this.service.oauthLogin().done(function() {
                if (self.hide()) {
                    if (self.loginCallback) {
                        self.loginCallback();
                    }
                }
            })
            .fail(function(error) {
                console.log('OAuth login error: ' + error);
            });
        return false;
    }

    _showError(error_msg) {
        this.errorEl.html(error_msg);
        this.spinnerEl.hide();
        this.errorEl.showImportant();
        this.emailEl.focus();
    }

    _showLoading() {
        // remove and add spinner element to restart animation
        let newone = this.spinnerEl.clone();
        this.spinnerEl.replaceWith(newone);
        this.spinnerEl = newone;
        this.errorEl.hide();
        this.spinnerEl.showImportant();
        this.buttonEl.val(BTN_CAPTION_WAIT);
        this.buttonEl.removeClass('ctr-active');
    }

    _onSubmitForm() {
        if (!this.buttonEl.hasClass('ctr-active')) {
            return false;
        }
        let self = this;
        this._showLoading();
        this.service.login(this.emailEl.val(), this.passwordEl.val(), function(promise) {
            promise.done(function() {
                    self.hide();
                    if (self.loginCallback) {
                        self.loginCallback();
                    }
                })
                .fail(function(error) {
                    self._showError(error);
                    self._activateSubmitButton();
                });
        });
        return false;
    }

    _activateSubmitButton() {
        this.buttonEl.val(BTN_CAPTION_LOGIN);
        this.buttonEl.addClass('ctr-active');
    }

    //***** Public ****************************************************************************************************

    show(service, loginCallback) {
        this._createEl();
        this.service = service;
        this.loginCallback = loginCallback;
        this._activateSubmitButton();
        this._bindEvents();
        this.containerEl.show()
        this.emailEl.focus();
    }

    hide() {
        if (this.isVisible()) {
            this.containerEl.hide();
            return true;
        }
        return false;
    }

    isVisible() {
        return this.el && this.el.is(':visible');
    }
}