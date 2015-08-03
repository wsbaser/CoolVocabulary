/**
 * Created by wsbaser on 25.03.2015.
 */

function GoogleService(provider){
    DictionaryService.call(this, provider.config, provider);
};

GoogleService.prototype = Object.create(DictionaryService.prototype);

GoogleService.prototype.generateTranslationsTab = function(data){
    var translationsListHtml = $(data.entry).map(function (entry) {
        var reverseTranslationsHtml = $(entry.reverse_translation).map(function (word) {
            return strHelper.format(GoogleTemplates.REVERSE_TRANSLATION,{word: word});
        }).toArray().join(', ');
        return strHelper.format(GoogleTemplates.TRANSLATIONS_ITEM, {
            word: entry.word,
            reverseTranslations: reverseTranslationsHtml
        });
    }).toArray().join('');
    var translationsHtml = strHelper.format(GoogleTemplates.TRANSLATIONS, {
        word: data.word,
        pos: data.pos,
        translationsListHtml: translationsListHtml
    });
    return $('<section/>',{html:translationsHtml}).html();
    // translationsListEl.find('.gt-baf-back').each(function(i,linkEl) {
    //     $(linkEl).bind('click', function (e) {
    //         ctrContent.showDialog(e.target.textContent);
    //     });
    // });
};

GoogleService.prototype.generateDefinitionsTab = function(data){
    var contentEl = null;
    if (data.definitions.length > 0) {
        var definitionsListHtml = $(data.definitions).map(function (item) {
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
    return contentEl.outerHTML();
};

GoogleService.prototype.generateExamplesTab = function(data){
    if (data.examples.length > 0) {
        var examplesListHtml = $(data.examples).map(function (example) {
            return strHelper.format(GoogleTemplates.EXAMPLE_ITEM, {
                example: example
            });
        }).toArray().join('');
        var examplesHtml = strHelper.format(GoogleTemplates.EXAMPLES, {
            examplesListHtml: examplesListHtml
        });
        contentEl = $('<section/>', {html: examplesHtml});
    }
    return contentEl.html();
};

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

GoogleTemplates.DEFINITION_ITEM =
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