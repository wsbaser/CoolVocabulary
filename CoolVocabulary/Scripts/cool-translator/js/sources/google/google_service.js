/**
 * Created by wsbaser on 25.03.2015.
 */

function GoogleService(provider){
    DictionaryService.call(this, provider.config, provider);
    this.cacheResponseData = true; 
    this.singleCacheObject = true;
};

GoogleService.prototype = Object.create(DictionaryService.prototype);

GoogleService.prototype.generateTranslationsCard = function(data){
    if(data && data.translations && Object.keys(data.translations).length){
        var translationsHtml = '';
        for (var sp in data.translations) {
            var spTranslations = data.translations[sp];
            var listHtml = $.map(spTranslations, function (entry) {
                var reverseTranslationsHtml = $.map(entry.reverse_translation||[], function (word) {
                    return strHelper.format(GoogleTemplates.REVERSE_TRANSLATION,{word: word});
                }).join(', ');
                return strHelper.format(GoogleTemplates.TRANSLATIONS_ITEM, {
                    word: entry.word,
                    reverseTranslations: reverseTranslationsHtml
                });
            }).join('');
            translationsHtml += strHelper.format(GoogleTemplates.TRANSLATIONS_LIST, {
                pos: sp,
                translationsListHtml: listHtml
            });
        };
        var headerHtml = strHelper.format(GoogleTemplates.TRANSLATIONS_HEADER,{
            word: data.word
        });
        var contentEl = $('<section/>', { html: headerHtml+translationsHtml });
        this.addTranslateContentEvent(contentEl, '.gt-baf-back');
        return contentEl.outerHTML();
    }
    return null;
};

GoogleService.prototype.generateDefinitionsCard = function(data){
    if (data && data.definitions && Object.keys(data.definitions).length) {
        var definitionsHtml = '';
        for (var sp in data.definitions) {
            var spDefinitions = data.definitions[sp];
            if(spDefinitions.length){
                var listHtml = $.map(spDefinitions, function (item) {
                    return strHelper.format(GoogleTemplates.DEFINITION_ITEM, {
                        definition: item.definition,
                        example: item.example||''
                    });
                }).join('');
                definitionsHtml += strHelper.format(GoogleTemplates.DEFINITIONS, {
                    pos: sp,
                    definitionsListHtml: listHtml
                });
            }
        };
        var headerHtml = strHelper.format(GoogleTemplates.DEFINITIONS_HEADER,{
            word: data.word
        });

        return $('<section/>', { html: headerHtml+definitionsHtml }).outerHTML();
    }
    return null;
};

GoogleService.prototype.generateExamplesCard = function(data){
    if (data && data.examples.length > 0) {
        var examplesListHtml = $.map(data.examples, function (example) {
            return strHelper.format(GoogleTemplates.EXAMPLE_ITEM, {
                example: example
            });
        }).join('');
        var examplesHtml = strHelper.format(GoogleTemplates.EXAMPLES, {
            examplesListHtml: examplesListHtml
        });
        return $('<section/>', {html: examplesHtml}).outerHTML();
    }
    return null;
};

GoogleService.prototype.getTranslations = function(inputData){
    var responseData = this.getCachedCard(inputData, ContentTypes.TRANSLATIONS);
    var result = {};
    if(responseData && responseData.translations){
        var translations = {};
        $.each(responseData.translations, function(sp, spTranslations){
            sp = SpeachParts.parseEn(sp);
            translations[sp]=[];
            for (var i = spTranslations.length - 1; i >= 0; i--) {
                translations[sp].push(spTranslations[i].word);
            };
        });
        result[inputData.word] = translations;
    }
    return result;
};

GoogleService.prototype.detectLanguage = function(word){
    return this.provider.detectLanguage(word);
};

//===== GoogleTemplates ================================================================================================
GoogleTemplates = {};

GoogleTemplates.TRANSLATIONS_HEADER = 
    '<div class="gt-cd-t">'+
    '<span class="gt-card-ttl-txt" style="direction: ltr;">{word}</span>: translations'+
    '</div>';

GoogleTemplates.TRANSLATIONS_LIST =
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

GoogleTemplates.DEFINITIONS_HEADER =
    '<div class="gt-cd-t">'+
    '<span class="gt-card-ttl-txt" style="direction: ltr;">{word}</span>&nbsp;&ndash; definitions'+
    '</div>';

GoogleTemplates.DEFINITIONS =
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
'<div class="gt-cd-t">Examples</div>'+
'<div class="gt-cd-c">{examplesListHtml}</div>';

GoogleTemplates.EXAMPLE_ITEM =
'<div class="gt-ex-info">' +
'<div dir="ltr" class="gt-ex-text">{example}</div>' +
'</div>';