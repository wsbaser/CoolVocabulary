/**
 * Created by wsbaser on 25.03.2015.
 */
function LingueeProvider(config){
    DictionaryProvider.call(this,config);
}

LingueeProvider.prototype = Object.create(DictionaryProvider.prototype);

LingueeProvider.prototype.requestTranslationsData = function(requestData) {
    return this.requestPage(this.config.ajax.translate, requestData, '.innercontent');
};