function DictionaryService(config, provider){
	this.config = config;
	this.provider = provider;
	this.cache = {};
}

DictionaryService.prototype.getRequestDataHash = function(requestName, requestData) {
    var hash = '';
    for (var key in requestData)
        hash += key + ':' + requestData[key] + ',';
    return requestName + ':' + hash.substr(0, hash.length - 1);
};

DictionaryService.prototype.getFromCache = function(requestName, requestData){
	var requestHash = this.getRequestDataHash(requestName, requestData);
	return this.cache[requestHash];
};

DictionaryService.prototype.saveToCache = function(requestName, requestData, data){
	var requestHash = this.getRequestDataHash(requestName, requestData);
	this.cache[requestHash] = data;
};

DictionaryService.prototype.generateCard = function(contentType, data){
    var methodName = 'generate'+ strHelper.capitalizeFirstLetter(contentType) + 'Card';
    var method = this[methodName];
    if(method==null)
        throw new Error('Content type not supported');
    return this[methodName](data);
};

/* If service did not recognized word it can provide prompts with similar words */
DictionaryService.prototype.generatePrompts = function(contentType, data){
    var methodName = 'generate'+ strHelper.capitalizeFirstLetter(contentType) + 'Prompts';
    var method = this[methodName];
    if(this[methodName]==null)
    	return null;
	return this[methodName](data);
};

DictionaryService.prototype.getCards = function(requestData){
	var self = this;
	var cards = {};
	$.each(this.config.contentTypes, function(i, contentType){
		var deferred = $.Deferred();
		cards[contentType] = deferred;
		var data = self.getData(contentType, requestData);
		data.done(function(data){
			deferred.resolve({
				inputData:requestData,
				cards: self.generateCard(contentType,data),
				prompts: self.generatePrompts(contentType,data)});
		})
		.fail(function(error){
			deferred.reject({
				inputData: requestData,
				error: error
			});
		});
	});
	return cards;
};

DictionaryService.prototype.getData = function(contentType, requestData){
	var requestName = this.provider.getRequestName(contentType);
	var data = this.getFromCache(requestName, requestData);
	if(data==null){
		data = this.provider[requestName](requestData);
		this.saveToCache(requestName, requestData, data);
	}
	return data;
};

/* HELPERS */

DictionaryService.prototype.deactivateLinks = function(rootEl, selector) {
    rootEl.find(selector).each(function (i, itemEl) {
    	itemEl = $(itemEl);
        itemEl.attr('href', 'javascript:void(0)');
    });
};

DictionaryService.prototype.addTranslateContentEvent = function(rootEl, selector){
    rootEl.find(selector).each(function(i, itemEl){
        this.addEventData($(itemEl),'click','show_dialog_for_content','this');
    }.bind(this));
};

DictionaryService.prototype.set1pxAsSrc = function(rootEl,className) {
    rootEl.find('.' + className).each(function (i, el) {
        $(el).attr('src', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi+P//PwNAgAEACPwC/tuiTRYAAAAASUVORK5CYII=");
    });
};

DictionaryService.prototype.addEventData = function(el, event, method, params){
	var eventParams = Array.prototype.slice.call(arguments, 1, arguments.length);
	el.attr('data-event', eventParams.join('|'))
};
