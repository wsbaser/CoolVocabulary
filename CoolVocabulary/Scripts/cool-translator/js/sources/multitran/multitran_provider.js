/**
 * Created by wsbaser on 25.03.2015.
 */
function MultitranProvider(config){
    DictionaryProvider.call(this,config);
}

MultitranProvider.prototype = Object.create(DictionaryProvider.prototype);

MultitranProvider.prototype.requestTranslationsData = function(requestData) {
  return this.requestPage(this.config.ajax.translate, requestData, '.middle_col>.search+table');
};