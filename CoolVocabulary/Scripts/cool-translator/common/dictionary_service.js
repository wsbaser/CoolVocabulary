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

DicionaryService.prototype.getCards = function(requestData){
	var data = this.getData();
	var cards = {};
	for (var contentType in this.contentTypes) {
		var deferred = $.Deferred();
		cards[contentType] = $.Deferred();
		data[contentType].done(function(data){
			deferred.resolve(this.generateCard(contentType,data));
		})
		.fail(function(data){
			deferred.resolve(generateError(data));
		});
	};
	return cards;
};

DicionaryService.prototype.getData = function(contentType, requestData){
	var data = {};
	var requestName = this.provider.getRequestName(contentType);
	data[contentType] = this.getFromCache(requestName, requestData);
	if(data[contentType]==null)
		data[contentType] = this.provider[requestName](requestData);
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



