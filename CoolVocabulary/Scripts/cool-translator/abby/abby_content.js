/**
 * Created by wsbaser on 05.03.2015.
 */
// ==UserScript==
// @name AbbyContent
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

/**
 * @requires jquery.js
 * @requires utils.js
 * @requires content_utils.js
 * @requires content_source.js
 */

//===== AbbySource =====================================================================================================

function AbbySource(config,defaultTabId) {
    AbbySource.superclass.constructor.apply(this, arguments);
}


extend(AbbySource,SourceWithTabs,(function() {
    function addDomainToScr(rootEl) {
        rootEl.find('.g-icons').each(function (i, el) {
            el.setAttribute('src', this.config.domain + el.getAttribute('src'));
        }.bind(this));
    }

    // function set1pxAsSrc(rootEl,className) {
    //     rootEl.find('.' + className).each(function (i, el) {
    //         el.setAttribute('src', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi+P//PwNAgAEACPwC/tuiTRYAAAAASUVORK5CYII=");
    //     }.bind(this));
    // }

    // function bindLinkTranslation(rootEl, className) {
    //     rootEl.find('.' + className).each(function (i, itemEl) {
    //         itemEl.attr('href', 'javascript:void(0)');
    //         itemEl.bind('click', function (e) {
    //             ctrContent.showDialog(e.target.textContent.trim());
    //         });
    //     });
    // }

    function prepareTranslationsTab(result) {
        var tab = this.tabs.Translations;

        // // .create element from response html
        // var responseEl = $(result.response);

        // // . retrieve actual subtree
        // var contentEl = responseEl.getElementsByClassName('l-article')[0];
        // if(!contentEl)
        //     tab.init(result.inputData, createWarningEl('Translations not found'))
        // else {
        //     // . correct transcription image "src" attribute
        //     contentEl.find('.l-article__transcription').each(function (i, el) {
        //         var transcriptionSrc = this.config.domain + el.getAttribute('src');
        //         el.setAttribute('src', transcriptionSrc);
        //     }.bind(this));

        //     // . Remove navigation panel
        //     contentEl.find('.l-article__navpanel').remove();

        //     // . Remove title from translations
        //     contentEl.find('.l-article__showExamp').each(function (i, itemEl) {
        //         itemEl.setAttribute('title', '');
        //         itemEl.setAttribute('href', 'javascript:void(0)');
        //     });

        //     // . Show translation for word
        //     bindLinkTranslation(contentEl,'l-article__commentlink');

            // . append new tab content to article element
            tab.init(result.inputData, contentEl,this._addTranslation.createElement());
            this._addTranslation.connectTranslationsList(tab, 'l-article__showExamp');
        }
    };

    function preparePhrasesTab(result) {
        var tab = this.tabs.Phrases;
        // .create element from response html
        var responseEl = $(result.response);
        // . retrieve actual subtree
        var contentEl = responseEl.getElementsByClassName('l-phrases__tblphrase')[0];
        // if (!contentEl)
        //     tab.init(result.inputData, createWarningEl('Examples not found'));
        // else {
        //     // . correct images "src" attribute
        //     set1pxAsSrc.call(this, contentEl, 'g-tblresult__pointer');
        //     // . remove last column
        //     contentEl.find('.l-phrases__tblphrase__td').remove();
        //     // . remove duplicate rows
        //     var rows = contentEl.querySelectorAll('.js-phrases-table tr');
        //     var prevTransl, prevSrcword;
        //     for (var i = 0; i < rows.length; i++) {
        //         var srcwordEl = rows[i].querySelector('.srcwords');
        //         var translEl = rows[i].querySelector('.transl');
        //         if (!srcwordEl || !translEl)
        //             continue;
        //         var srcword = srcwordEl.textContent.trim();
        //         var transl = translEl.textContent.trim();
        //         if (prevTransl === transl && prevSrcword === srcword)
        //             rows[i].remove();
        //         prevTransl = transl;
        //         prevSrcword = srcword;
        //     }
        //     bindLinkTranslation(contentEl, 'l-phrases__link');
        //     var containerEl = $('<div/>', {'class': 'ctr-phrases-container'});
        //     containerEl.appendChild(contentEl);
            // . init tab
            tab.init(result.inputData, containerEl);
        }
    }
    // function createWarningEl(text) {
    //     var el = $('<div/>', {'class': 'ctr-tab-warning'});
    //     el.innerHTML = text;
    //     return el;
    // }

    function prepareExamplesTab(result) {
        var tab = this.tabs.Examples;
        // .create element from response html
        var responseEl = $(result.response);
        // . retrieve necessary subtree
        var contentEl = responseEl.getElementsByClassName('l-examples__tblExamp')[0];
        // if (!contentEl)
        //     tab.init(result.inputData, createWarningEl('Phrases not found'));
        // else {
        //     // . remove 'bad example' button
        //     contentEl.find('.l-examples__badexamp').remove();
        //     // . correct images "src" attribute
        //     set1pxAsSrc.call(this, contentEl, 'l-examples__switchbtn');
        //     // . configure
        //     contentEl.find('.js-examples-table-switchbtn').each(function (i, btnEl) {
        //         btnEl.click(function () {
        //             this.toggleClass('expanded');
        //             var row = this.closest('.js-examples-table-trans');
        //             var sourceEl = row.nextElementSibling.getElementsByClassName('js-examples-table-slidebox')[0];
        //             if (this.hasClass('expanded')) {
        //                 this.setAttribute("title", "Hide source");
        //                 sourceEl.show();
        //             }
        //             else {
        //                 this.setAttribute("title", "Show source");
        //                 sourceEl.hide();
        //             }
        //             return false;
        //         });
        //     });
        //     var containerEl = $('<div/>',{'class':'ctr-examples-container'});
        //     containerEl.appendChild(contentEl);
            // . init tab
            tab.init(result.inputData, containerEl);
        }
    }

    return {
        tabs: (function () {
            var tabs = {};
            tabs.Translations = new Tab('Translations', {
                requestMethodName: 'getTranslations',
                prepareTab: prepareTranslationsTab
            });
            tabs.Examples = new Tab('Examples', {
                requestMethodName: 'getExamples',
                prepareTab: prepareExamplesTab
            });
            tabs.Phrases = new Tab('Phrases', {
                requestMethodName: 'getPhrases',
                prepareTab: preparePhrasesTab
            });
            return tabs;
        })(),
        init: function () {
            AbbySource.superclass.init.call(this);
            this._addTranslation = new AddTranslationControl();
            var css = "#abby_article .g-icons {" +
                "background: url('" + ctrContent.config.path.images + "/abby_icons.png') !important;" +
                "}";
            cssHelper.addCss(css);
        },
        // . load data for tab and prepare tab content for display
        loadAndPrepareTab: function (tabId, data) {
            var tab = this.tabs[tabId];
            tab.showLoading(data, this.config.name);
            kango.invokeAsyncCallback(
                this.config.id + '.' + tab.options.requestMethodName,
                data, function (result) {
                    if (!this.validateResult(result))
                        return;
                    // everything is OK. prepare interface
                    tab.options.prepareTab.call(this, result);
                }.bind(this));
        },
        // . load data for source and prepare source for display
        loadAndShow: function (data) {
            // . do not show loading. show all the tabs from the start
            this.show();
            // . send requests for all tabs
            dictionaryHelper.each(this.tabs, function (tabId, tab) {
                this.loadAndPrepareTab(tabId, data);
            }.bind(this));
            // . show current or first tab
            AbbySource.superclass.selectTab.call(this, this.currentTabId || dictionaryHelper.first(this.tabs).id);
        },
        selectTab: function (tabId) {
            var tab = this.tabs[tabId];
            if (!Dialog.isInputDataEqual(Dialog.lastRequestData, tab.data))
                this.loadAndPrepareTab(tabId, Dialog.lastRequestData);
            AbbySource.superclass.selectTab.call(this, tabId);
        }
    }
})());

//======================================================================================================================

var abbyContent = new AbbySource(AbbyConfig(),'Translations');