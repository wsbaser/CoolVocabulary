/**
 * Created by wsbaser on 25.04.2015.
 */
var TfdProvider = function(config){
    DictionaryProvider.call(this, config);
};

TfdProvider.prototype = Object.create(DictionaryProvider.prototype);

TfdProvider.prototype.getRequestName = function(contentType){
    this.checkIfContentTypeSupported(contentType);
    return 'loadWordPage';
};

TfdProvider.prototype.loadWordPage = function(requestData) {
    return this.requestPage(this.config.ajax.translate, requestData, '#MainTxt');
};