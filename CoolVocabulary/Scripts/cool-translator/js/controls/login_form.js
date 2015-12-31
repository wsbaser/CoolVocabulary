/***** Login Form *****************************************************************************************************/
function LoginForm(containerElementSelector) {
    this.containerElementSelector = containerElementSelector;
};

LoginForm.BTN_CAPTION_LOGIN = 'Login';
LoginForm.BTN_CAPTION_WAIT = 'Please wait...';

LoginForm.TEMPLATE = 
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
                <input type="submit" value="Login" class="blue-button blurred"/></li>\
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
            </ul>\
        </form>\
    </div>\
</div>';

//===== Private ==========
LoginForm.prototype._createEl = function(){
    this.containerEl = $(this.containerElementSelector);
    this.containerEl.html(LoginForm.TEMPLATE);
    this.popoverEl = this.containerEl.children().first(); 
    this.el = this.popoverEl.children().first(); 
    this.emailEl = this.el.find('input[type="email"]');
    this.passwordEl = this.el.find('input[type="password"]');
    this.buttonEl = this.el.find('input[type="submit"]');
    this.spinnerEl = this.el.find('.ctr-spinner');
    this.errorEl = this.el.find('.ctr-error');
};

LoginForm.prototype._bindEvents = function() {
    var self = this;
    this.el.find('.ctr-login-form').on('submit', this._onSubmitForm.bind(this));
    this.el.find('.google-login').on('click', this._onOAuthLogin.bind(this));
    
    this.containerEl.bind('click', function () {
        self.hide();
    });
    this.el.on('click', function (e) {
        e.stopPropagation();
    });
    $(document).bind('keydown', function (e) {
        if (e.keyCode === 27) {
            self.hide();
            cancelEvent(e);
        }
    });
};

LoginForm.prototype._onOAuthLogin = function(){
    var self = this;
    this.service.oauthLogin().done(function(){ 
        self.hide();
        if(self.loginCallback){
            self.loginCallback();
        }
    })
    .fail(function(error){
        console.log('OAuth login error: ' + error);
    });
    return false;
}

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
            if(self.loginCallback){
                self.loginCallback();
            }
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
    this._createEl();
    this.service = service;
    this.loginCallback = loginCallback;
    this._activateSubmitButton();
    this._bindEvents();
    this.containerEl.show()
    this.emailEl.focus();
};

LoginForm.prototype.hide = function(){
    if(this.isVisible()){
        this.containerEl.hide();
    }
};

LoginForm.prototype.isVisible = function() {
    return this.el && this.el.is(':visible');
}
