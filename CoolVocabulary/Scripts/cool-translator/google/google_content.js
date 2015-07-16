/**
 * Created by wsbaser on 25.03.2015.
 */
/**
 * Created by wsbaser on 05.03.2015.
 */
// ==UserScript==
// @name GoogleContent
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
 * @requires content_source.js
 */

//===== GoogleSource ===================================================================================================

function GoogleSource(config,defaultTabId) {
    GoogleSource.superclass.constructor.apply(this, arguments);
}

extend(GoogleSource,SourceWithTabs,(function(){
    function prepareTranslationsTab(result) {
        var tab = this.tabs.Translations;
        // var translationsListHtml = $(result.response.entry).map(function (entry) {
        //     var reverseTranslationsHtml = $(entry.reverse_translation).map(function (word) {
        //         return strHelper.format(GoogleTemplates.REVERSE_TRANSLATION,{word: word});
        //     }).toArray().join(', ');
        //     return strHelper.format(GoogleTemplates.TRANSLATIONS_ITEM, {
        //         word: entry.word,
        //         reverseTranslations: reverseTranslationsHtml
        //     });
        // }).toArray().join('');
        // var translationsHtml = strHelper.format(GoogleTemplates.TRANSLATIONS, {
        //     word: result.response.word,
        //     pos: result.response.pos,
        //     translationsListHtml: translationsListHtml
        // });
        // var translationsListEl = $('<section/>',{html:translationsHtml});
        // translationsListEl.find('.gt-baf-back').each(function(i,linkEl) {
        //     $(linkEl).bind('click', function (e) {
        //         ctrContent.showDialog(e.target.textContent);
        //     });
        // });
        tab.init(result.inputData, translationsListEl,this._addTranslation.createElement());
        this._addTranslation.connectTranslationsList(tab, 'gt-baf-word-clickable');
    };

    function prepareDefinitionsTab(result) {
        var tab = this.tabs.Definition;
        var contentEl = null;
        // if (result.response.definitions.length > 0) {
        //     var definitionsListHtml = $(result.response.definitions).map(function (item) {
        //         return strHelper.format(GoogleTemplates.DEFINITION_ITEM, {
        //             definition: item.definition,
        //             example: item.example
        //         });
        //     }).toArray().join('');
        //     var definitionsHtml = strHelper.format(GoogleTemplates.DEFINITIONS, {
        //         word: result.response.word,
        //         pos: result.response.pos,
        //         definitionsListHtml: definitionsListHtml
        //     });
        //     contentEl = $('<section/>', {html: definitionsHtml});
        // }
        tab.init(result.inputData, contentEl);
    };

    function prepareExamplesTab(result) {
        var tab = this.tabs.Examples;
        var contentEl = null;
        // if (result.response.examples.length > 0) {
        //     var examplesListHtml = $(result.response.examples).map(function (example) {
        //         return strHelper.format(GoogleTemplates.EXAMPLE_ITEM, {
        //             example: example
        //         });
        //     }).toArray().join('');
        //     var examplesHtml = strHelper.format(GoogleTemplates.EXAMPLES, {
        //         examplesListHtml: examplesListHtml
        //     });
        //     contentEl = $('<section/>', {html: examplesHtml});
        // }
        tab.init(result.inputData, contentEl);
    };

    function prepare(result) {
        if(!result.response)
            this.setWarning('No results for &quot;' + result.inputData.word + '&quot;');
        else{
            prepareTranslationsTab.call(this, result);
            prepareDefinitionsTab.call(this, result);
            prepareExamplesTab.call(this, result);
        }
    };

    return {
        tabs: (function () {
            var tabs = {};
            tabs.Translations = new Tab('Translations');
            tabs.Definition = new Tab('Definitions');
            tabs.Examples = new Tab('Examples');
            return tabs;
        })(),
        init:function() {
            GoogleSource.superclass.init.call(this);
            this._addTranslation = new AddTranslationControl();
        },
        prepare: prepare
    };
})());


//======================================================================================================================
GoogleHandlers = {};
GoogleHandlers.selectTranslation = function(e) {
    var targetItemEl = $(e.target).closest('gt-baf-word-clickable');
    if (!targetItemEl)
        throw new Error('click not inside translation item');
    if (targetItemEl.hasClass('ctr-addedTranslItem'))
        return;
    this._addTranslation.setTranslation(targetItemEl.textContent.trim());
    this.tabs.Translations.rootEl.find('.gt-baf-word-clickable').each(function (i, itemEl) {
        targetItemEl === itemEl ?
            itemEl.addClass('ctr-selectedTranslItem') :
            itemEl.removeClass('ctr-selectedTranslItem');
    });
    e.preventDefault();
    return false;
};


var googleContent = new GoogleSource(GoogleConfig(), 'Translations');