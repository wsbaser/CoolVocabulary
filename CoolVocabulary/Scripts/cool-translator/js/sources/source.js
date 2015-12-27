function Source(service,tabs) {
    this.service = service;
    this.config = service.config;
    this.tabs = tabs;
    this.data = null;
    this.linkEl = null;
    this.rootEl = null;
    this.navigationEl = null;
    this.articleEl = null;
    this.currentTabIndex = null;
};

Source.ACTIVE_CLASS = 'ctr-active';
Source.ROOT_CLASS = 'ctr-source-root';
Source.ARTICLE_CLASS = 'ctr-source-article';
Source.NAVIGATION_CLASS = 'ctr-source-navigation';

Source.prototype.init = function () {
    this.createRootEl();
    this.selectTab(0);
};

Source.prototype.createRootEl = function() {
    this.rootEl = $('<div/>',{'class': Source.ROOT_CLASS});
    this.navigationEl = this._addRootChild(this.createNavigationEl);
    this.articleEl = this._addRootChild(this.createArticleEl);
};

Source.prototype._addRootChild = function(create) {
    var el = create.call(this);
    el.hide();
    this.rootEl.append(el);
    return el;
};

Source.prototype.createNavigationEl = function () {
    var self = this;
    var navigationEl = $('<div/>', {'class': Source.NAVIGATION_CLASS});
    // . create tab links
    var ul = $('<ul/>');
    var tabLinkWidth = 100 / this.tabs.length + '%';
    $.each(this.tabs, function (index, tab) {
        tab.navigationEl[0].style.setProperty('width', tabLinkWidth, 'important');
        tab.navigationEl.click(function (event) {
            self.selectTab(index);
        });
        ul.append(tab.navigationEl);
    });
    if(this.tabs.length==1)
        this.tabs[0].navigationEl.hide();

    // . append tab links to navigation element
    navigationEl.append(ul);
    return navigationEl;
};

Source.prototype.createArticleEl = function () {
    var articleEl = $('<div/>', {id: this.config.id + '_article', 'class': Source.ARTICLE_CLASS});
    $.each(this.tabs, function (key, tab) {
        articleEl.append(tab.rootEl);
    });
    return articleEl;
};

Source.prototype.showTabsLoading = function(requestData) {
    var self = this;
    $.each(this.tabs, function (key, tab) {
        tab.showLoading(requestData, self.config.name);
    });
    this.navigationEl.show();
    this.articleEl.show();
};

Source.prototype.validateResult = function (result) {
    if(!isInputDataEqual(result.inputData, this.lastRequestData))
        return false;
    return true;
};

Source.prototype.supportsLanguagePair = function (lp) {
    var language = this.config.languages[lp.sourceLang];
    return  language &&
        (language.targets.indexOf(lp.targetLang) != -1 || 
        lp.sourceLang === lp.targetLang);
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

//===== SourceWithTabs =================================================================================================
Source.prototype.getTab = function(contentType){
    return $.grep(this.tabs, function(tab,i){
        return tab.contentType === contentType;
    })[0];
};

// . load data for source and prepare source for display
Source.prototype.loadAndShow = function (requestData) {
    var self = this;
    this.lastRequestData = requestData;
    this.showTabsLoading(requestData);
    // . always show the most important tab by default 
    this.selectTab(0);
    // . get all cards from service at once
    this.service.getCards(requestData, function(cards){
        $.each(cards, function(contentType, promise){
            var tab = self.getTab(contentType);
            promise.done(function(result){
                if (!self.validateResult(result))
                    return;
                tab.init(result.inputData, result.cards, null, result.prompts);
            })
            .fail(function(result){
                tab.init(result.inputData, null, result.error);
            });
        });
    });
};

Source.prototype.selectTab = function (tabIndex) {
    if (tabIndex!=null){
        if (this.currentTabIndex!=null)
            this.tabs[this.currentTabIndex].hide();
        this.tabs[tabIndex].show();
        this.currentTabIndex = tabIndex;
    }
};

Source.prototype.isDataEqualTo = function (data) {
    var currentData = this.currentTabIndex ? this.tabs[this.currentTabIndex].data : null;
    return isInputDataEqual(currentData, data);
};

Source.prototype.selectNeighbourTab = function(right) {
    if (this.isArticleDisplayed()) {
        var neighbourTabIndex = this.currentTabIndex;
        do {
            neighbourTabIndex = right ?
            (neighbourTabIndex + 1) % this.tabs.length :
            (neighbourTabIndex || this.tabs.length) - 1;
        } while (!this.tabs[neighbourTabIndex].isActive() &&
            neighbourTabIndex!=this.currentTabIndex);
        this.selectTab(neighbourTabIndex);
    }
};
Source.prototype.selectNextNavigationItem = function () {
    this.selectNeighbourTab(true);
};
Source.prototype.selectPrevNavigationItem = function () {
    this.selectNeighbourTab(false);
};
Source.prototype.isLoading = function() {
    return this.tabs[this.currentTabIndex].isLoading;
};
Source.prototype.clear = function() {
    this.articleEl.innerHTML = '';
    this.navigationEl.hide();
    $.each(this.tabs, function (key, tab) {
        tab.clear();
    });
};
Source.prototype.show = function(){
    this.rootEl.show();
    this.tabs[this.currentTabIndex].adjustContentHeight();
};
Source.prototype.hide = function(){
    this.rootEl.hide();
};