/***** NotificationPopup **********************************************************************************************/

function NotificationPopup(rootElementSelector) {
    this.el = $(rootElementSelector);
    this.titleEl = this.el.find('.ctr-ntfTitle');
    this.bodyEl = this.el.find('.ctr-ntfBody');
    this.el.on('mouseout', function () {
        if (this.showTimeoutExpired)
            this.hide();
    }.bind(this));
};

NotificationPopup.prototype.show = function(title,bodyHtml) {
    this.el.removeClass('ctr-ntfError');
    this.titleEl.html(title);
    this.bodyEl.html(bodyHtml);
    this._hideAfterTimeout(3000);
    this.el.showImportant();
};

NotificationPopup.prototype.showError = function(bodyHtml) {
    this.el.addClass('ctr-ntfError');
    this.titleEl.html('Error');
    this.bodyEl.html(bodyHtml);
    this._hideAfterTimeout(5000);
    this.el.showImportant();
};

NotificationPopup.prototype.hide = function(){
    this.el.hide();
};

NotificationPopup.prototype._isHovered = function() {
    return (this.el.parent().find(':hover')[0] === this.el[0]);
};

NotificationPopup.prototype._hideAfterTimeout = function(timeout) {
    this.showTimeoutExpired = false;
    window.setTimeout(function () {
        this.showTimeoutExpired = true;
        if (!this._isHovered())
            this.hide();
    }.bind(this), timeout);
};


