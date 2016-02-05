'use strict';

import DictionaryProvider from '../common/dictionary-provider';

export default class MultitranProvider extends DictionaryProvider {
	constructor(config){
		super(config);
	}
	
	requestTranslationsData(requestData) {
		return this.requestPage(this.config.ajax.translate, requestData, '.middle_col>.search+table');
	}
}