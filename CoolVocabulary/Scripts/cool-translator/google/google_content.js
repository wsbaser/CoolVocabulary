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
        var translationsListHtml = $(result.response.entry).map(function (entry) {
            var reverseTranslationsHtml = $(entry.reverse_translation).map(function (word) {
                return strHelper.format(GoogleTemplates.REVERSE_TRANSLATION,{word: word});
            }).toArray().join(', ');
            return strHelper.format(GoogleTemplates.TRANSLATIONS_ITEM, {
                word: entry.word,
                reverseTranslations: reverseTranslationsHtml
            });
        }).toArray().join('');
        var translationsHtml = strHelper.format(GoogleTemplates.TRANSLATIONS, {
            word: result.response.word,
            pos: result.response.pos,
            translationsListHtml: translationsListHtml
        });
        var translationsListEl = $('<section/>',{html:translationsHtml});
        translationsListEl.find('.gt-baf-back').each(function(i,linkEl) {
            $(linkEl).bind('click', function (e) {
                ctrContent.showDialog(e.target.textContent);
            });
        });
        tab.init(result.inputData, translationsListEl,this._addTranslation.createElement());
        this._addTranslation.connectTranslationsList(tab, 'gt-baf-word-clickable');
    };

    function prepareDefinitionsTab(result) {
        var tab = this.tabs.Definition;
        var contentEl = null;
        if (result.response.definitions.length > 0) {
            var definitionsListHtml = $(result.response.definitions).map(function (item) {
                return strHelper.format(GoogleTemplates.DEFINITION_ITEM, {
                    definition: item.definition,
                    example: item.example
                });
            }).toArray().join('');
            var definitionsHtml = strHelper.format(GoogleTemplates.DEFINITIONS, {
                word: result.response.word,
                pos: result.response.pos,
                definitionsListHtml: definitionsListHtml
            });
            contentEl = $('<section/>', {html: definitionsHtml});
        }
        tab.init(result.inputData, contentEl);
    };

    function prepareExamplesTab(result) {
        var tab = this.tabs.Examples;
        var contentEl = null;
        if (result.response.examples.length > 0) {
            var examplesListHtml = $(result.response.examples).map(function (example) {
                return strHelper.format(GoogleTemplates.EXAMPLE_ITEM, {
                    example: example
                });
            }).toArray().join('');
            var examplesHtml = strHelper.format(GoogleTemplates.EXAMPLES, {
                examplesListHtml: examplesListHtml
            });
            contentEl = $('<section/>', {html: examplesHtml});
        }
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

//===== GoogleTemplates ================================================================================================
GoogleTemplates = {};

GoogleTemplates.TRANSLATIONS =
'<div class="gt-cd-t"><span class="gt-card-ttl-txt" style="direction: ltr;">{word}</span>: варианты перевода</div>'+
'<div class="gt-cd-c"><table class="gt-baf-table"><tbody>'+
'<tr><td colspan="4"><div class="gt-baf-cell gt-baf-pos-head"><span class="gt-cd-pos">{pos}</span></div></td></tr>'+
'{translationsListHtml}'+
'</tbody></table></div>';

GoogleTemplates.TRANSLATIONS_ITEM =
'<tr><td colspan="2"><div class="gt-baf-cell gt-baf-word-clickable">{word}</div></td>'+
'<td style="width: 100%;">'+
'<div class="gt-baf-cell gt-baf-translations">{reverseTranslations}</div>'+
'</td>'+
'</tr>';
GoogleTemplates.REVERSE_TRANSLATION ='<span class="gt-baf-back">{word}</span>';

GoogleTemplates.DEFINITIONS =
'<div class="gt-cd-t"><span class="gt-card-ttl-txt" style="direction: ltr;">{word}</span>&nbsp;&ndash; определения</div>'+
'<div class="gt-cd-c">' +
'<div class="gt-cd-pos">{pos}</div>' +
'<div class="gt-def-list" style="direction: ltr;">{definitionsListHtml}</div>' +
'</div>';

GoogleTemplates.DEFINITION_ITEM=
'<div class="gt-def-info">' +
'<div class="gt-def-row">{definition}</div>' +
'<div class="gt-def-example">{example}</div>' +
'</div>';

GoogleTemplates.EXAMPLES =
'<div class="gt-cd-t">Примеры</div>'+
'<div class="gt-cd-c">{examplesListHtml}</div>';

GoogleTemplates.EXAMPLE_ITEM =
'<div class="gt-ex-info">' +
'<div dir="ltr" class="gt-ex-text">{example}</div>' +
'</div>';

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