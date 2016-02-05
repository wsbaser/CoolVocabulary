'use strict';

import ContentTypes from '../common/content-types';
import DictionaryProvider from '../common/dictionary-provider';

export default class AbbyProvider extends DictionaryProvider{
	constructor(config){
		super(config);
	}
	
	requestTranslations(requestData) {
	    return this.requestPage(this.config.ajax.translate, requestData, '.l-article');
	}

	requestExamples(requestData) {
	    return this.requestPage(this.config.ajax.examples, requestData, '.l-examples__tblExamp');
	}

	requestPhrases(requestData) {
	    return this.requestPage(this.config.ajax.phrases, requestData, '.l-phrases__tblphrase');
	}

	getTranslationsData(requestData){
	    var requests = {};
	    requests[ContentTypes.TRANSLATIONS] = this.requestTranslations(requestData);
	    requests[ContentTypes.EXAMPLES] = this.requestExamples(requestData);
	    requests[ContentTypes.PHRASES] = this.requestPhrases(requestData);
	    return requests;
	}
}