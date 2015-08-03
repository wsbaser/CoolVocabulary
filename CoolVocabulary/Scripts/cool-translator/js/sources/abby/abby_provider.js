/**
 * Created by wsbaser on 16.03.2015.
 */
/* Wraps interaction with Translation Source server */

function AbbyProvider(config){
    DictionaryProvider.call(this, config);
};

AbbyProvider.prototype = Object.create(DictionaryProvider.prototype);

AbbyProvider.prototype.getRequestName = function(contentType){
    this.checkIfContentTypeSupported(contentType);
    return 'load'+ strHelper.capitalizeFirstLetter(contentType);
};

AbbyProvider.prototype.loadTranslations = function(requestData) {
    return this.requestPage(this.config.ajax.translate, requestData, '.l-article');
};

AbbyProvider.prototype.loadExamples = function(requestData) {
    return this.requestPage(this.config.ajax.examples, requestData, '.l-examples__tblExamp');
};

AbbyProvider.prototype.loadPhrases = function(requestData) {
    return this.requestPage(this.config.ajax.phrases, requestData, '.l-phrases__tblphrase');
};