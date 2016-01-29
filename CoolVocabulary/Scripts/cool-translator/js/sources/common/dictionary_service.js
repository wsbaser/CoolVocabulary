function DictionaryService(config, provider){
	this.config = config;
	this.provider = provider;
	this.requestCache = {};
	this.cacheResponseData = false;
	this.singleCacheObject = false;
}

DictionaryService.prototype.getResolvedPromise = function(data){
	var deferred = $.Deferred();
	deferred.resolve(data);
	return deferred.promise();
};

DictionaryService.prototype.getCardHash = function(requestData, contentType) {
	var hash = '';
    for (var key in requestData){
        hash += key + ':' + requestData[key] + ',';
	}
    contentType = this.singleCacheObject?'':contentType;
    return contentType + ':' + hash.substr(0, hash.length - 1);
};

DictionaryService.prototype.getCachedCard = function(requestData, contentType){
	var hash = this.getCardHash(requestData, contentType);
	return this.requestCache[hash];
};

DictionaryService.prototype.saveToCache = function(requestData, contentType, card){
	var requestHash = this.getCardHash(requestData, contentType);
	this.requestCache[requestHash] = card;
};

DictionaryService.prototype.generateCard = function(contentType, data){
	var methodName = 'generate' + strHelper.capitalizeFirstLetter(contentType) + 'Card';
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

DictionaryService.prototype.getCachedCards = function(requestData){
	if(this.singleCacheObject)
		return this.getCachedCard(requestData);
	else{
		var self = this;
		var cards = {};
		$.each(this.config.contentTypes, function(i, contentType){
			cards[contentType] = self.getCachedCard(requestData, contentType);
		});
		return cards;
	}
};

DictionaryService.prototype.getCards = function(requestData){
	var self = this;
	var dataPromises = this.provider.getTranslationsData(requestData);
	var cards = {};
	$.each(dataPromises, function(contentType, dataPromise){
		var deferred = $.Deferred();
		cards[contentType] = deferred;
		dataPromise.done(function(data){
			var card = self.generateCard(contentType, data);
			deferred.resolve({
				inputData: requestData,
				cards: card,
				prompts: self.generatePrompts(contentType, data)});
			var cachedData = self.cacheResponseData ? data : card;
			self.saveToCache(requestData, contentType, cachedData);
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

/* HELPERS */

DictionaryService.prototype.makeStylesImportant = function(rootEl, selector){
    rootEl.find(selector).each(function (i, itemEl) {
        var itemStyle = itemEl.style;
        for(var key in itemStyle){
            if(itemStyle.hasOwnProperty(key) && itemStyle[key]){
                itemStyle.setProperty(key, itemStyle[key], "important");
            }
        }
    });
};

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

/* GET DATA FUNCTIONS */

DictionaryService.prototype.getPronunciation = function(inputData){
	return null;
};

DictionaryService.prototype.getSoundUrls = function(inputData){
	return [];
};

DictionaryService.prototype.getPictureUrls = function(inputData){
	return [];
};

DictionaryService.prototype.getTranslations = function(inputData){
	return null;
};