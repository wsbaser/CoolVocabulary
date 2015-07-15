/**
 * Created by wsbaser on 16.03.2015.
 */
/* Wraps interaction with Translation Source server */

function AbbyProvider(config){
    SourceProvider.call(this, config);
};

AbbyProvider.prototype = Object.create(SourceProvider.prototype);

AbbyProvider.prototype.makeRequest = function(urlTemplate, requestData, responseSelector) {
    var deferred = $.Deferred();
    var translateUrl = this.formatRequestUrl(urlTemplate, requestData);
    $.get(translateUrl).when(function (data) {
        this.resolveWithJQueryElement(deferred, data, responseSelector);
    }, function (jqXHR) {
        this.rejectWithStatusCode(deferred, jqXHR);
    });
    return deferred.promise();
};

AbbyProvider.prototype.getRequestName = function(contentType){
    var requestName  = 'load'+ strHelper.capitalizeFirstLetter(contentType);
    if(!this[requestName])
        throw new Error('Content type ' + contentType + ' not supported');
    return requestName;
};

AbbyProvider.prototype.loadTranslations = function(requestData) {
    return this.makeRequest(this.config.ajax.translate, requestData, '.l-article');
};

AbbyProvider.prototype.loadExamples = function(requestData) {
    return this.makeRequest(this.config.ajax.examples, requestData, '.l-examples__tblExamp');
};

AbbyProvider.prototype.loadPhrases = function(requestData) {
    return this.makeRequest(this.config.ajax.phrases, requestData, '.l-phrases__tblphrase');
};