/**
 * Created by wsbaser on 13.07.2015.
 */
function DictionaryProvider(config){
    this.config = config;
};

DictionaryProvider.prototype.checkIfContentTypeSupported = function(contentType){
	if(this.config.contentTypes.indexOf(contentType)===-1)
		throw new Error("Content type " + contentType + ' not supported.');
};

DictionaryProvider.prototype.rejectWithStatusCode = function(deferred,xhr){
    deferred.reject(xhr.statusText + '. Status(' + xhr.status+')');
};

DictionaryProvider.prototype.rejectWithResponseText = function(deferred,xhr){
    switch(xhr.status){
        case 500:
            this.rejectWithStatusCode(deferred, xhr);
            break;
        case 0:
            deferred.reject('No Internet :((');            
            break;
        default:
            deferred.reject(xhr.responseText);
            break;
    }
};

DictionaryProvider.prototype.resolveWithJQueryElement = function(deferred,data,selector){
    deferred.resolve($(data).find(selector));
};

DictionaryProvider.prototype.formatRequestUrl = function(url, data){
    data = Object.create(data);
    var sourceLang = this.config.languages[data.sourceLang];
    var targetLang = this.config.languages[data.targetLang];
    data.sourceLangId = sourceLang && sourceLang.id;
    data.targetLangId = targetLang && targetLang.id;
    return strHelper.format(url, data);
};

DictionaryProvider.prototype.requestPage = function(urlTemplate, requestData, responseSelector) {
    var self = this;
    var deferred = $.Deferred();
    var translateUrl = this.formatRequestUrl(urlTemplate, requestData);
    console.log(translateUrl);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', translateUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return;
      if (xhr.status != 200) {
        self.rejectWithStatusCode(deferred, xhr);
      } else {
        self.resolveWithJQueryElement(deferred, xhr.responseText, responseSelector);
      }
    }
    return deferred.promise();
};

/*
*	Matches contentType to service request
*/
DictionaryProvider.prototype.getRequestName = function(contentType){
	throw new Error('Not implemented');
};

DictionaryProvider.prototype.getTranslationsData = function(requestData){
    var cards = {};
    var deferred = this.requestTranslationsData(requestData);
    $.each(this.config.contentTypes, function(i, contentType){
        cards[contentType] = deferred;
    });
    return cards;
};