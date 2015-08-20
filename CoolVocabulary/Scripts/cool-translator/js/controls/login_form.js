/***** Login Form *****************************************************************************************************/
function LoginForm(rootElementSelector) {
    this.el = $(rootElementSelector);
    this.emailEl = this.el.find('input[type="email"]');
    this.passwordEl = this.el.find('input[type="password"]');
    this.buttonEl = this.el.find('input[type="submit"]');
    this.spinnerEl = this.el.find('.ctr-spinner');
    this.errorEl = this.el.find('.ctr-error');
    this._bindEvents();
};

LoginForm.BTN_CAPTION_LOGIN = 'Login';
LoginForm.BTN_CAPTION_WAIT = 'Please wait...';

//===== Private ==========

LoginForm.prototype._bindEvents = function() {
    this.el.find('.ctr-login-form').bind('submit', this._onSubmitForm.bind(this));
    this.el.find('form').on('click', function (e) {
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
    this.errorEl.html(error_msg);
    this.spinnerEl.hide();
    this.errorEl.show();
    this.emailEl.focus();
}

LoginForm.prototype._showLoading = function() {
    // remove and add spinner element to restart animation
    var newone = this.spinnerEl[0].cloneNode(true);
    this.spinnerEl.replaceWith(newone);
    this.spinnerEl = $(newone);
    this.errorEl.hide();
    this.spinnerEl.show();
    this.buttonEl.value = LoginForm.BTN_CAPTION_WAIT;
    this.buttonEl.removeClass('ctr_active');
};

LoginForm.prototype._onSubmitForm = function() {
    var self = this;
    this._showLoading();
    this.service.login(this.emailEl.val(), this.passwordEl.val(), function(promise){
        promise.done(function(){
            self.hide();
            self.loginCallback();
        })
        .fail(function(error){
            self._showError(error);
            self._activateSubmitButton();
        });
    });
    return false;
};

LoginForm.prototype._activateSubmitButton = function() {
    this.buttonEl.value = LoginForm.BTN_CAPTION_LOGIN;
    this.buttonEl.addClass('ctr_active');
};

//===== Public ==========

LoginForm.prototype.show = function (service, loginCallback) {
    this.service = service;
    this.loginCallback = loginCallback;
    this._activateSubmitButton();
    this.el.show()
    this.emailEl.focus();
};

LoginForm.prototype.hide = function(){
    this.el.hide();
};

LoginForm.prototype.isVisible = function() {
    return this.el.is(':visible');
}
