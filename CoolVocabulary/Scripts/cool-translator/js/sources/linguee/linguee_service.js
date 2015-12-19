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
    // . remove phrases
    translationsEl.find('.example_lines').remove();
    this.removeExpandIcon(translationsEl);
    return translationsEl.outerHTML();
};

LingueeService.prototype.generatePhrasesCard = function(contentEl){
    var phrasesEl = contentEl.find('.example_lines');
    this.deactivateLinks(phrasesEl, '.dictLink');
    this.addTranslateContentEvent(phrasesEl, '.dictLink');
    return phrasesEl.outerHTML();
};

LingueeService.prototype.generateExamplesCard = function(contentEl){
    var examplesEl = contentEl.find('#result_table');
    return examplesEl.outerHTML();
};