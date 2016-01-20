Vocabulary.LanguageDELearnRoute = Vocabulary.BookLearnIndexRoute.extend({
	model: function(){
		var sessionBookWords = thid.modelFor('language.DE');
		this.sessionWords = this.getSessionWords(sessionBookWords);
		return this.requestWordTranslations(this.sessionWords, 0, SESSION_WORDS_COUNT);
	}
});
