/**
 * Created by wsbaser on 13.07.2015.
 */

 var ContentTypes = {};
ContentTypes.TRANSLATIONS = "translations";
ContentTypes.DEFINITIONS = "definitions";
ContentTypes.EXAMPLES = "examples";
ContentTypes.PHRASES = "phrases";
ContentTypes.VERBTABLE = "translations";

function SourceProvider(config){
    this.config = config;
};

SourceProvider.prototype.rejectWithStatusCode = function(deferred,jqXHR){
    deferred.reject('Error. Status('+jqXHR.status+')');
};

SourceProvider.prototype.resolveWithJQueryElement = function(deferred,data,selector){
    deferred.resolve($(data).find(selector));
};

SourceProvider.prototype.formatRequestUrl = function(url, data){
    return url.replace('{sourceLang}', data.sourceLang)
        .replace('{targetLang}', data.targetLang)
        .replace('{word}', data.word);
};

/*
*	Matches contentType to service request
*/
SourceProvider.prototype.getRequestName = function(contentType){
	throw new Error('Not implemented');
};