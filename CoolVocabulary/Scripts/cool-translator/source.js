function Source(config,tabs,isExtension,options) {
    this.config = config;
    this.tabs = tabs;
    this.isExtension = isExtension;
    this.options = options||{};
    if(this.isExtension){
        if(!this.options.injectStyle)
            throw new Error('\'injectStyle\' method not specified');
    }
    this.data = null;
    this.linkEl = null;
    this.rootEl = null;
    this.navigationEl = null;
    this.articleEl = null;
    this.currentTabId = null;
};

Source.ROOT_CLASS = 'ctr-source-root';
Source.ARTICLE_CLASS = 'ctr-source-article';
Source.NAVIGATION_CLASS = 'ctr-source-navigation';
Source.WARNING_CLASS = 'ctr-source-warning';

Source.prototype.init = function () {
    if(this.isExtension){
        setTimeout(function () {
            this.options.injectStyle(this.config.id + 'Style', this.config.path.templatesDir);
        }.bind(this), 500);
    }
    this.createRootEl();
};

Source.prototype.createRootEl = function() {
    this.rootEl = $('<div/>',{'class': Source.ROOT_CLASS});
    this.navigationEl = this._addRootChild(this.createNavigationEl);
    this.articleEl = this._addRootChild(this.createArticleEl);
    this.warningEl = this._addRootChild(this.createWarningEl);
};

Source.prototype._addRootChild = function(create) {
    var el = create.call(this);
    el.hide();
    this.rootEl.appendChild(el);
    return el;
};

Source.prototype.createNavigationEl = function () {
    var self = this;
    var navigationEl = $('<div/>', {'class': Source.NAVIGATION_CLASS});
    // . create tab links
    var ul = $('<ul/>');
    var tabLinkWidth = 100 / Object.keys(this.tabs).length + '%';
    $.each(this.tabs, function (id, tab) {
        var li = $('<li/>',{class:Classes.ACTIVE});
        li.css('width', tabLinkWidth, 'important');
        var a = $('<a/>', {
            id: tab.linkId(),
            html: tab.title,
            click: function (event) {
                if (self.tabs[id].hasContent || self.tabs[id].isLoading)
                    self.selectTab(id);
            }
        });
        li.appendChild(a);
        ul.appendChild(li);
        tab.navigationEl = li;
    });

    // . append tab links to navigation element
    navigationEl.appendChild(ul);
    return navigationEl;
};

Source.prototype.createArticleEl = function () {
    return $('<div/>', {id: this.config.id + '_article', 'class': Source.ARTICLE_CLASS});
};

Source.prototype.createWarningEl = function () {
    return $('<div/>',{'class':Source.WARNING_CLASS});
};

// Source.prototype.showLoading(data) {
//     this.navigationEl.hide();
//     this.articleEl.hide();
//     this.warningEl.hide();
//     this.loadingEl.getElementsByClassName('ctr-word')[0].innerHTML = data.word;
//     this.loadingEl.show();
// };

Source.prototype.show = function () {
    // . hide loading, show article
    var self = this;
    if(this.hasWarning())
        this.warningEl.show();
    else {
        // . prepare article
        this.articleEl.empty();
        $.each(this.tabs, function (key, tab) {
            self.articleEl.appendChild(tab.rootEl);
        });
        this.navigationEl.show();
        this.articleEl.show();
    }
};

Source.prototype.validateResult = function (result) {
    if(!TranslationDialog.isInputDataEqual(result.inputData, TranslationDialog.lastRequestData))
        return false;
    if (result.error_msg) {
        this.setWarning(result.error_msg);
        this.show();
        return false;
    }
    return true;
};
Source.prototype.supportsLanguagePair = function (lp) {
    return this.config.sourceLanguages.indexOf(lp.sourceLang) != -1 &&
        this.config.targetLanguages.indexOf(lp.targetLang) != -1;
};
Source.prototype.linkId = function () {
    return 'ctr_sourcelink_' + this.config.id;
};
Source.prototype.isArticleDisplayed = function () {
    return this.articleEl.is(':visible');
};
Source.prototype.showLoginForm = function(onLoginSuccess) {
    onLoginSuccess();
};
Source.prototype.setWarning = function (warningText) {
    this.warningEl.html(warningText);
};

Source.prototype.hasWarning = function() {
    return this.warningEl.textContent.trim().length != 0;
};

//===== SourceWithTabs =================================================================================================
Source.prototype.getTabIdToSelect = function() {
    if (this.currentTabId && this.tabs[this.currentTabId].hasContent)
        return this.currentTabId;
    else {
        // find first tab with content
        var tabWithContent = $(this.tabs).grep(function(key, tab) {
            return tab.hasContent;
        })[0];
        return tabWithContent ? tabWithContent.id : null;
    }
};

Source.prototype.getTab = function(contentType){
    return $.grep(this.tabs,function(i,tab){
        return tab.contentType === contentType;
    })[0];
};

// . load data for source and prepare source for display
Source.prototype.loadAndShow = function (data) {
    this.show();
    // . get all cards from service at once
    var cards = this.service.getCards(data);
    var self = this;
    $(cards).each(function(contentType, promise){
        promise.done(function(result){
            if (!this.validateResult(result))
                return;
            var tab = self.getTab(contentType);
            tab.init(result.inputData, result.cards, null, result.prompts);
        })
        .fail(function(error){
            tab.init(result.inputData, null, error);
        });
    });
    // . show current or first tab
    // AbbySource.superclass.selectTab.call(this, this.currentTabId || dictionaryHelper.first(this.tabs).id);
    this.selectTab(getTabIdToSelect.call(this));
};

Source.prototype.selectTab = function (tabId) {
    if (!tabId)
        return;
    if (this.currentTabId) {
        var currentTab = this.tabs[this.currentTabId];
        currentTab.navigationEl.removeClass(Classes.SELECTED);
        currentTab.rootEl.hide();
    }

    var tab = this.tabs[tabId];
    // . show tab link
    tab.navigationEl.addClass(Classes.SELECTED);
    // . show tab content
    tab.rootEl.show();

    this.currentTabId = tabId;
};

Source.prototype.adjustArticleHeight = function () {
    $.each(this.tabs, function(key,tab){
        tab.adjustContentHeight();
    });
};

Source.prototype.isDataEqualTo = function (data) {
    var currentData = this.currentTabId ? this.tabs[this.currentTabId].data : null;
    return TranslationDialog.isInputDataEqual(currentData, data);
};

Source.prototype.selectNeighbourTab:function(right) {
    if (this.isArticleDisplayed()) {
        var tabIds = Object.keys(this.tabs);
        var currentTabIndex = tabIds.indexOf(this.currentTabId);
        do {
            currentTabIndex = right ?
            (currentTabIndex + 1) % tabIds.length :
            (currentTabIndex || tabIds.length) - 1;
        } while (!this.tabs[tabIds[currentTabIndex]].navigationEl.hasClass(Classes.ACTIVE));
        this.selectTab(tabIds[currentTabIndex]);
    }
};
Source.prototype.selectNextNavigationItem = function () {
    this.selectNeighbourTab(true);
};
Source.prototype.selectPrevNavigationItem = function () {
    this.selectNeighbourTab(false);
};
Source.prototype.isLoading = function() {
    return this.tabs[this.currentTabId].isLoading;
};
Source.prototype.clear = function() {
    this.articleEl.innerHTML = '';
    this.navigationEl.hide();
    $.each(this.tabs, function (key, tab) {
        tab.clear();
    });
};