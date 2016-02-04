'use strict';

import '../../styles/translation-dialog.styl';

const ACTIVE_CLASS = 'ctr-active';
const ROOT_CLASS = 'ctr-source-root';
const ARTICLE_CLASS = 'ctr-source-article';
const NAVIGATION_CLASS = 'ctr-source-navigation';

export default class Source {
    constructor(service, tabs) {
        this.service = service;
        this.config = service.config;
        this.tabs = tabs;
        this.data = null;
        this.linkEl = null;
        this.rootEl = null;
        this.navigationEl = null;
        this.articleEl = null;
        this.currentTabIndex = null;
    }

    init() {
        this._createRootEl();
        this.selectTab(0);
    }

    _isInputDataEqual(data1, data2) {
        data1 = data1 || {};
        data2 = data2 || {};
        return data1.word == data2.word &&
            data1.sourceLang == data2.sourceLang &&
            data1.targetLang == data2.targetLang;
    }


    _createRootEl() {
        this.rootEl = $('<div/>', {
            'class': ROOT_CLASS
        });
        this.navigationEl = this._addRootChild(this._createNavigationEl);
        this.articleEl = this._addRootChild(this._createArticleEl);
    }

    _addRootChild(create) {
        let el = create.call(this);
        el.hide();
        this.rootEl.append(el);
        return el;
    }

    _createNavigationEl() {
        let self = this;
        let navigationEl = $('<div/>', {
            'class': NAVIGATION_CLASS
        });
        // . create tab links
        let ul = $('<ul/>');
        let tabLinkWidth = 100 / this.tabs.length + '%';
        $.each(this.tabs, function(index, tab) {
            tab.navigationEl[0].style.setProperty('width', tabLinkWidth, 'important');
            tab.navigationEl.click(function(event) {
                self.selectTab(index);
            });
            ul.append(tab.navigationEl);
        });
        if (this.tabs.length == 1)
            this.tabs[0].navigationEl.hide();

        // . append tab links to navigation element
        navigationEl.append(ul);
        return navigationEl;
    }

    _createArticleEl() {
        let articleEl = $('<div/>', {
            id: this.config.id + '_article',
            'class': ARTICLE_CLASS
        });
        $.each(this.tabs, function(key, tab) {
            articleEl.append(tab.rootEl);
        });
        return articleEl;
    }

    _showTabsLoading(requestData) {
        let self = this;
        $.each(this.tabs, function(key, tab) {
            tab.showLoading(requestData, self.config.name);
        });
        this.navigationEl.show();
        this.articleEl.show();
    }

    _validateResult(result) {
        if (!this._isInputDataEqual(result.inputData, this.lastRequestData))
            return false;
        return true;
    }

    _getTab(contentType) {
        return $.grep(this.tabs, function(tab, i) {
            return tab.contentType === contentType;
        })[0];
    }

    _selectNeighbourTab(right) {
        if (this.isArticleDisplayed()) {
            let neighbourTabIndex = this.currentTabIndex;
            do {
                neighbourTabIndex = right ?
                    (neighbourTabIndex + 1) % this.tabs.length :
                    (neighbourTabIndex || this.tabs.length) - 1;
            } while (!this.tabs[neighbourTabIndex].isActive() &&
                neighbourTabIndex != this.currentTabIndex);
            this.selectTab(neighbourTabIndex);
        }
    }

    //***** PUBLIC ****************************************************************************************************

    supportsLanguagePair(lp) {
        let language = this.config.languages[lp.sourceLang];
        return language &&
            (language.targets.indexOf(lp.targetLang) != -1 ||
                lp.sourceLang === lp.targetLang);
    }

    linkId() {
        return 'ctr_sourcelink_' + this.config.id;
    }

    isArticleDisplayed() {
        return this.articleEl.is(':visible');
    }

    showLoginForm(onLoginSuccess) {
        onLoginSuccess();
    }

    // . load data for source and prepare source for display
    loadAndShow(requestData) {
        let self = this;
        this.lastRequestData = requestData;
        this._showTabsLoading(requestData);
        // . always show the most important tab by default 
        this.selectTab(0);
        // . get all cards from service at once
        this.service.getCards(requestData, function(cards) {
            $.each(cards, function(contentType, promise) {
                let tab = self._getTab(contentType);
                promise.done(function(result) {
                        if (!self._validateResult(result))
                            return;
                        tab.init(result.inputData, result.cards, null, result.prompts);
                    })
                    .fail(function(result) {
                        tab.init(result.inputData, null, result.error);
                    });
            });
        });
    }

    selectTab(tabIndex) {
        if (tabIndex != null) {
            if (this.currentTabIndex != null)
                this.tabs[this.currentTabIndex].hide();
            this.tabs[tabIndex].show();
            this.currentTabIndex = tabIndex;
        }
    }

    isDataEqualTo(data) {
        let currentData = this.currentTabIndex ? this.tabs[this.currentTabIndex].data : null;
        return this._isInputDataEqual(currentData, data);
    }

    selectNextNavigationItem() {
        this._selectNeighbourTab(true);
    }

    selectPrevNavigationItem() {
        this._selectNeighbourTab(false);
    }

    isLoading() {
        return this.tabs[this.currentTabIndex].isLoading;
    }

    clear() {
        this.articleEl.innerHTML = '';
        this.navigationEl.hide();
        $.each(this.tabs, function(key, tab) {
            tab.clear();
        });
    }

    show() {
        this.rootEl.show();
        this.tabs[this.currentTabIndex].adjustContentHeight();
    }

    hide() {
        this.rootEl.hide();
    }
}