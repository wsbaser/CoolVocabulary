'use strict';

export default class LangDetector{
	constructor(config, connection){
	    this.config = config;
	    this.connection = connection;
	}

	detect(word,callback){
    	this.connection.makeRequest(this.config.id, 'detectLanguage', [word], callback);
	}
}