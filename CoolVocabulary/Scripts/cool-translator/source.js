/**
 * Created by wsbaser on 11.05.2015.
 */
// ==UserScript==
// @name CoolTranslatorSource
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

//===== Tab ============================================================================================================

function Tab(id,options) {
    options = options || {};
    this.id = id;
    this.title = options.title || id;
    this.options = options;
    this.rootEl = $('<div/>');
    this.rootEl.hide();
    this.loadingEl = null;
    this.navigationEl = null;
    this.hasContent = false;
    this.isLoading = false;
}

Tab.LOADING_CLASS = 'ctr-tab-loading';

Tab.prototype.linkId =function() {
    return 'ctr_tablink_' + this.id;
};

Tab.prototype.init = function(data,contentEl,addTranslationEl) {
    this.isLoading = false;
    this.data = data;
    this.contentEl = contentEl;
    this.addTranslationEl = addTranslationEl;
    this.hasContent = !!this.contentEl;
    this.rootEl.innerHTML = '';
    if (this.hasContent) {
        this.rootEl.appendChild(this.contentEl);
        this.navigationEl.addClass(Classes.ACTIVE)
        if (this.addTranslationEl)
            this.rootEl.appendChild(this.addTranslationEl);
        this.adjustContentHeight();
    }
    else
        this.navigationEl.removeClass(Classes.ACTIVE)
};

Tab.prototype.createLoadingEl = function() {
    return $('<div/>', {
        'class': Tab.LOADING_CLASS,
        html: strHelper.format(Source.LOADING_TMPL, {
            contentType: this.id.toLowerCase()
        })
    });
};

Tab.prototype.showLoading = function(data,sourceName) {
    this.isLoading = true;
    if (!this.loadingEl)
        this.loadingEl = this.createLoadingEl();
    this.loadingEl.getElementsByClassName('ctr-word')[0].innerHTML = data.word;
    this.loadingEl.getElementsByClassName('ctr-sourceName')[0].innerHTML = sourceName;
    this.rootEl.innerHTML = '';
    this.rootEl.appendChild(this.loadingEl);
};
Tab.prototype.clear = function(){
    this.rootEl.innerHTML = '';
};
Tab.prototype.adjustContentHeight = function() {
    if(this.hasContent) {
        this.contentEl.style.setProperty("overflow", "auto", "important");
        this.contentEl.style.maxHeight =
            document.documentElement.clientHeight -
            Dialog.headerEl.clientHeight -
            this.navigationEl.clientHeight -
            (this.addTranslationEl ? this.addTranslationEl.clientHeight : 0) +
            'px';
    }
};
//===== Source =========================================================================================================
function Source(config) {
    this.config = config;
    this.data = null;
    this.linkEl = null;
    this.linkEl = null;
    this.rootEl = null;
    this.navigationEl = null;
    this.loadingEl = null;
    this.articleEl = null;
    this._addTranslation = null;
};

Source.ROOT_CLASS = 'ctr-source-root';
Source.ARTICLE_CLASS = 'ctr-source-article';
Source.NAVIGATION_CLASS = 'ctr-source-navigation';
Source.WARNING_CLASS = 'ctr-source-warning';
Source.LOADING_CLASS = 'ctr-source-loading';
Source.LOADING_TMPL =
    '<span>Loading {contentType} for &quot;<span class="ctr-word"></span>&quot; from <span class="ctr-sourceName"></span>...</span>' +
    '<div class="ctr-spinner" style="margin-top:10px !important;display: block !important;">' +
        '<div></div>' +
        '<div></div>' +
        '<div></div>' +
    '</div>';

Source.prototype = (function() {
    return {
        init: function () {
            setTimeout(function () {
                ctrContent.injectStyle(this.config.id + 'Style', this.config.path.templatesDir);
            }.bind(this), 500);
            this.createRootEl();
        },
        showLoading: function showLoading(data) {
            this.navigationEl.hide();
            this.articleEl.hide();
            this.warningEl.hide();
            this.loadingEl.getElementsByClassName('ctr-word')[0].innerHTML = data.word;
            this.loadingEl.show();
        },
        show: function () {
            this.loadingEl.hide();
            if (this.hasWarning())
                this.warningEl.show();
            else {
                this.navigationEl.show();
                this.articleEl.show();
                this.adjustArticleHeight();
            }
        },
        loadAndShow: function (data) {
            this.setWarning('');
            this.showLoading(data);
            kango.invokeAsyncCallback(
                this.config.id + '.getTranslations',
                data,
                function (result) {
                    if (!this.validateResult(result))
                        return;
                    this.prepare(result, this.show.bind(this));
                }.bind(this));
        },
        validateResult: function (result) {
            if(!Dialog.isInputDataEqual(result.inputData, Dialog.lastRequestData))
                return false;
            if (result.error_msg) {
                this.setWarning(result.error_msg);
                this.show();
                return false;
            }
            return true;
        },
        prepare: NOT_IMPLEMENTED,
        adjustArticleHeight: function () {
            this.articleEl.style.maxHeight =
                document.documentElement.clientHeight -
                Dialog.headerEl.clientHeight +
                'px';
        },
        createRootEl: function createRootEl() {
            this.rootEl = $('<div/>',{'class': Source.ROOT_CLASS});
            this.loadingEl = this.addRootChild(this.createLoadingEl);
            this.navigationEl = this.addRootChild(this.createNavigationEl);
            this.articleEl = this.addRootChild(this.createArticleEl);
            this.warningEl = this.addRootChild(this.createWarningEl);
        },
        addRootChild:function(create) {
            var el = create.call(this);
            el.hide();
            this.rootEl.appendChild(el);
            return el;
        },
        createLoadingEl: function () {
            var el = $('<div/>',{'class':Source.LOADING_CLASS});
            el.html(strHelper.format(Source.LOADING_TMPL, {contentType: 'translations'}));
            el.getElementsByClassName('ctr-sourceName')[0].innerHTML = this.config.name;
            return el;
        },
        createArticleEl: function () {
            return $('<div/>', {id: this.config.id + '_article', 'class': Source.ARTICLE_CLASS});
        },
        createNavigationEl: function () {
            return $('<div/>', {'class': Source.NAVIGATION_CLASS});
        },
        createWarningEl: function () {
            return $('<div/>',{'class':Source.WARNING_CLASS});
        },
        isDataEqualTo: function (data) {
            return Dialog.isInputDataEqual(this.data, data);
        },
        supportsLanguagePair: function (lp) {
            return this.config.sourceLanguages.indexOf(lp.sourceLang) != -1 &&
                this.config.targetLanguages.indexOf(lp.targetLang) != -1;
        },
        linkId: function () {
            return 'ctr_sourcelink_' + this.config.id;
        },
        selectNextNavigationItem: function () {/* there are no navigation items here */
        },
        selectPrevNavigationItem: function () {/* there are no navigation items here */
        },
        isArticleDisplayed: function () {
            return this.articleEl.is(':visible');
        },
        showLoginForm:function(onLoginSuccess) {
            onLoginSuccess();
        },
        isLoading: function() {
            return this.loadingEl.is(':visible');
        },
        clear: function() {
            this.articleEl.innerHTML = '';
            this.navigationEl.hide();
        },
        setWarning: function (warningText) {
            this.warningEl.innerHTML = warningText;
        },
        hasWarning:function() {
            return this.warningEl.textContent.trim().length != 0;
        }
};
})();
//===== SourceWithTabs =================================================================================================
function SourceWithTabs(config) {
    SourceWithTabs.superclass.constructor.call(this, config);
    this.currentTabId = null;
};

extend(SourceWithTabs,Source,(function() {
    function getTabIdToSelect() {
        if (this.currentTabId && this.tabs[this.currentTabId].hasContent)
            return this.currentTabId;
        else {
            // find first tab with content
            var tabWithContent = dictionaryHelper.searchFirst(this.tabs, function (key, tab) {
                return tab.hasContent;
            });
            return tabWithContent ? tabWithContent.id : null;
        }
    }

    return {
        show: function () {
            // . hide loading, show article
            this.loadingEl.hide();
            if(this.hasWarning())
                this.warningEl.show();
            else {
                // . prepare article
                this.articleEl.innerHTML = '';
                dictionaryHelper.each(this.tabs, function (key, tab) {
                    this.articleEl.appendChild(tab.rootEl);
                }.bind(this));
                this.navigationEl.show();
                this.articleEl.show();
            }
        },
        loadAndShow: function (data) {
            this.setWarning('');
            this.showLoading(data);
            kango.invokeAsyncCallback(
                this.config.id + '.getTranslations',
                data,
                function (result) {
                    if (!this.validateResult(result))
                        return;
                    this.prepare(result);
                    this.show();
                    this.selectTab(getTabIdToSelect.call(this));
                }.bind(this));
        },
        selectTab: function (tabId) {
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
        },
        adjustArticleHeight: function () {
            dictionaryHelper.each(this.tabs,function(key,tab){
                tab.adjustContentHeight();
            });
        },
        createNavigationEl: function () {
            var navigationEl = SourceWithTabs.superclass.createNavigationEl.call(this);

            // . create tab links
            var ul = $('<ul/>');
            var tabLinkWidth = 100 / Object.keys(this.tabs).length + '%';
            dictionaryHelper.each(this.tabs, function (id, tab) {
                var li = $('<li/>',{class:Classes.ACTIVE});
                li.css('width', tabLinkWidth, 'important');
                var a = $('<a/>', {
                    id: tab.linkId(),
                    html: tab.title,
                    click: function (event) {
                        if (this.tabs[id].hasContent || this.tabs[id].isLoading)
                            this.selectTab(id);
                    }.bind(this)
                });
                li.appendChild(a);
                ul.appendChild(li);
                tab.navigationEl = li;
            }.bind(this));

            // . append tab links to navigation element
            navigationEl.appendChild(ul);
            return navigationEl;
        },
        isDataEqualTo: function (data) {
            var currentData = this.currentTabId ? this.tabs[this.currentTabId].data : null;
            return Dialog.isInputDataEqual(currentData, data);
        },
        selectNeighbourTab:function(right) {
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
        },
        selectNextNavigationItem: function () {
            this.selectNeighbourTab(true);
        },
        selectPrevNavigationItem: function () {
            this.selectNeighbourTab(false);
        },
        isLoading:function() {
            return this.tabs[this.currentTabId].isLoading;
        },
        clear: function() {
            SourceWithTabs.superclass.clear.call(this);
            dictionaryHelper.each(this.tabs, function (key, tab) {
                tab.clear();
            });
        }
    };
})());

function NOT_IMPLEMENTED(){
    throw new Error('Not implemented');
}