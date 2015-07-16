/**
 * Created by wsbaser on 13.07.2015.
 */
function DictionaryProvider(config){
    this.config = config;
};

DictionaryProvider.prototype.checkIfContentTypeSupported = function(contentType){
	if(this.config.contentTypes.indexOf(contentType)===-1)
		throw new Error("Content type "+contentType+' not supported.');
};

DictionaryProvider.prototype.rejectWithStatusCode = function(deferred,jqXHR){
    deferred.reject('Error. Status('+jqXHR.status+')');
};

DictionaryProvider.prototype.resolveWithJQueryElement = function(deferred,data,selector){
    deferred.resolve($(data).find(selector));
};

DictionaryProvider.prototype.formatRequestUrl = function(url, data){
    return url.replace('{sourceLang}', data.sourceLang)
        .replace('{targetLang}', data.targetLang)
        .replace('{word}', data.word);
};

AbbyProvider.prototype.requestPage = function(urlTemplate, requestData, responseSelector) {
    var deferred = $.Deferred();
    var translateUrl = this.formatRequestUrl(urlTemplate, requestData);
    $.get(translateUrl).when(function (data) {
        this.resolveWithJQueryElement(deferred, data, responseSelector);
    }, function (jqXHR) {
        this.rejectWithStatusCode(deferred, jqXHR);
    });
    return deferred.promise();
};

/*
*	Matches contentType to service request
*/
DictionaryProvider.prototype.getRequestName = function(contentType){
	throw new Error('Not implemented');
};