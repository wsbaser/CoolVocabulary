/**
 * Created by wsbaser on 25.04.2015.
 */
function LingueeService(provider){
    DictionaryService.call(this, provider.config, provider);
};

LingueeService.prototype = Object.create(DictionaryService.prototype);

LingueeService.prototype.removeExpandIcon = function(el){
    // TODO: add expanding support later
    el.find('.expand_i').remove();
};

LingueeService.prototype.generateTranslationsCard = function(contentEl){
    var translationsEl = contentEl.find('.exact').clone();
    this.deactivateLinks(translationsEl, 'a');
    // . Show translation for word
    this.addTranslateContentEvent(translationsEl, '.tag_lemma>.dictLink');
    // . remove phrases
    translationsEl.find('.example_lines').remove();
    this.removeExpandIcon(translationsEl);
    return translationsEl.outerHTML();
};

LingueeService.prototype.generatePhrasesCard = function(contentEl){
    var phrasesEl = contentEl.find('.example_lines');
    phrasesEl.find('h3').remove();
    this.deactivateLinks(phrasesEl, '.dictLink');
    this.addTranslateContentEvent(phrasesEl, '.dictLink');
    return phrasesEl.outerHTML();
};

// LingueeService.prototype.generateExamplesCard = function(contentEl){
//     var examplesEl = contentEl.find('#result_table');
//     return examplesEl.outerHTML();
// };

LingueeService.SpeachParts = {
    en: {
        'noun': SpeachParts.NOUN, 
        'verb': SpeachParts.VERB,
        'adjective': SpeachParts.ADJECTIVE,
        'adverb': SpeachParts.ADVERB }
};

LingueeService.prototype.parseSpeachPart = function(text, language){
    var dict = LingueeService.SpeachParts[language];
    return dict[text]?dict[text]:SpeachParts.UNKNOWN;
};

LingueeService.prototype.getTranslations = function(inputData){
    var self = this;
    var card = this.getCachedCard(inputData,ContentTypes.TRANSLATIONS);
    var result = {};
    if(card){
        var translationsEl = $(card);
        var lemmaList = translationsEl.find('.lemma');
        for (var i = lemmaList.length - 1; i >= 0; i--) {
            var el = $(lemmaList[i]);
            var translations = {};
            var lemma = el.find('.dictLink,.dictTerm').flatText();
            el.find('.tag_trans').each(function(index, tagTransEl){
                tagTransEl = $(tagTransEl);
                var sp = self.parseSpeachPart(tagTransEl.find('.tag_type').attr('title'), inputData.sourceLang);
                if(!translations[sp])
                    translations[sp] = [];
                translations[sp].push(tagTransEl.find('.dictLink').text());
            });
            result[lemma] = translations;
        }
    }
    return result;
};
