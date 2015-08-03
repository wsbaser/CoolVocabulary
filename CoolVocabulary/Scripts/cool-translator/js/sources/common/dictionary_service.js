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
	var data = this.cache[requestHash];
	if (Object.keys(this.cache).indexOf(requestHash)!=-1) {
	    var deferred = $.Deferred();
	    deferred.resolve(data);
	    return deferred.promise();
	}
	return null;
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
	if(data==null)
		data = this.provider[requestName](requestData);
	return data;
};

/* HELPERS */

DictionaryService.prototype.deactivateLinks = function(rootEl, className) {
    rootEl.find('.' + className).each(function (i, itemEl) {
    	itemEl = $(itemEl);
        itemEl.attr('href', 'javascript:void(0)');
        // itemEl.bind('click', function (e) {
        //     ctrContent.showDialog(e.target.textContent.trim());
        // });
    });
};

DictionaryService.prototype.set1pxAsSrc = function(rootEl,className) {
    rootEl.find('.' + className).each(function (i, el) {
        $(el).attr('src', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi+P//PwNAgAEACPwC/tuiTRYAAAAASUVORK5CYII=");
    });
}



