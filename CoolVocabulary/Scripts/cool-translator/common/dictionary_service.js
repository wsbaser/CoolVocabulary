function DicionaryService(config, provider, contentTypes){
	this.provider = provider;
	this.contentTypes = contentTypes;
	this.cache = {};
}

DicionaryService.prototype.getRequestDataHash = function(requestName, requestData) {
    var hash = '';
    for (var key in requestData)
        hash += key + ':' + requestData[key] + ',';
    return requestName + ':' + hash.substr(0, hash.length - 1);
};

DicionaryService.prototype.getFromCache = function(requestName, requestData){
	var requestHash = this.getRequestDataHash(requestName, requestData);
	var data = this.cache[requestHash];
	if (Object.keys(this.cache).indexOf(requestHash)!=-1) {
	    var deferred = $.Deferred();
	    deferred.resolve(data);
	    return deferred.promise();
	}
	return null;
};

DicionaryService.prototype.generateCard = function(contentType, data){
    var methodName = 'generate'+ strHelper.capitalizeFirstLetter(contentType) + 'Card';
    var method = this[methodName];
    if(method==null)
        throw new Error('Content type not supported');
    return this[methodName](data);
};

/* If service did not recognized word it can provide prompts with similar words */
DicionaryService.prototype.generatePrompts = function(contentType, data){
    var methodName = 'generate'+ strHelper.capitalizeFirstLetter(contentType) + 'Prompts';
    var method = this[methodName];
    if(this[methodName]==null){
    	methodName ='generatePrompts'; 
    	if(this[methodName]==null)
    		return null;
    }
	return this[methodName](data);
};

DicionaryService.prototype.getCards = function(requestData){
	var cards = {};
	for (var contentType in this.contentTypes) {
		var deferred = $.Deferred();
		cards[contentType] = deferred;
		var data = this.getData(contentType, requestData);
		data.done(function(data){
			deferred.resolve({
				inputData:requestData,
				cards: this.generateCard(contentType,data),
				prompts: this.generatePrompts(contentType,data)});
		})
		.fail(function(error){
			deferred.resolve(error);
		});
	};
	return cards;
};

DicionaryService.prototype.getData = function(contentType, requestData){
	var requestName = this.provider.getRequestName(contentType);
	var data = this.getFromCache(requestName, requestData);
	if(data==null)
		data = this.provider[requestName](requestData);
	return data;
};

/* HELPERS */

DicionaryService.prototype.deactivateLinks = function(rootEl, className) {
    rootEl.find('.' + className).each(function (i, itemEl) {
        itemEl.attr('href', 'javascript:void(0)');
        // itemEl.bind('click', function (e) {
        //     ctrContent.showDialog(e.target.textContent.trim());
        // });
    });
};

DicionaryService.prototype.set1pxAsSrc = function(rootEl,className) {
    rootEl.find('.' + className).each(function (i, el) {
        el.attr('src', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi+P//PwNAgAEACPwC/tuiTRYAAAAASUVORK5CYII=");
    }.bind(this));
}



