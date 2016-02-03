'use strict';

import DictionaryProvider from '../common/dictionary-provider';

export default class LingueeProvider {
	requestTranslationsData(requestData) {
		return this.requestPage(this.config.ajax.translate, requestData, '.innercontent');
	}
}