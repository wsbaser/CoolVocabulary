'use strict';

export default class DictionaryServiceProxy{
	constructor(config, connection){
	    this.config = config;
	    this.connection = connection;
	}

	makeCall(method, params, callback){
		this.connection.makeRequest(this.config.id, method, params, callback);
	}

	getCards(requestData, callback){
    	this.makeCall('getCards', [requestData], callback);
	}
}