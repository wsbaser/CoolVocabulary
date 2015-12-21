/**
 * Created by wsbaser on 25.03.2015.
 */
function LingueeProvider(config){
    DictionaryProvider.call(this,config);
}

LingueeProvider.prototype = Object.create(DictionaryProvider.prototype);

LingueeProvider.prototype.requestTranslationsData = function(requestData) {
	requestData = Object.create(requestData);
	requestData.sourceLangName = this.config.languages[requestData.sourceLang].name;
	requestData.targetLangName = this.config.languages[requestData.targetLang].name;
    return this.requestPage(this.config.ajax.translate, requestData, '.innercontent');
};