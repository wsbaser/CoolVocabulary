'use strict';

import DictionaryProvider from '../common/dictionary-provider';

export default class TfdProvider extends DictionaryProvider {
	requestTranslationsData(requestData) {
		return this.requestPage(this.config.ajax.translate, requestData, '#MainTxt');
	}
}