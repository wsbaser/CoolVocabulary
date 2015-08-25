/**
 * Created by wsbaser on 16.03.2015.
 */
/* Wraps interaction with Translation Source server */

function AbbyProvider(config){
    DictionaryProvider.call(this, config);
};

AbbyProvider.prototype = Object.create(DictionaryProvider.prototype);

AbbyProvider.prototype.requestTranslations = function(requestData) {
    return this.requestPage(this.config.ajax.translate, requestData, '.l-article');
};

AbbyProvider.prototype.requestExamples = function(requestData) {
    return this.requestPage(this.config.ajax.examples, requestData, '.l-examples__tblExamp');
};

AbbyProvider.prototype.requestPhrases = function(requestData) {
    return this.requestPage(this.config.ajax.phrases, requestData, '.l-phrases__tblphrase');
};

AbbyProvider.prototype.getTranslationsData = function(requestData){
    var requests = {};
    requests[ContentTypes.TRANSLATIONS] = this.requestTranslations(requestData);
    requests[ContentTypes.EXAMPLES] = this.requestExamples(requestData);
    requests[ContentTypes.PHRASES] = this.requestPhrases(requestData);
    return requests;
};