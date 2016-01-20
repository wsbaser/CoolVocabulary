Vocabulary.LanguageDEIndexRoute = Vocabulary.BookExamIdexRoute.extend(Vocabulary.ExamRouteBase, {
	model: function(){
		var sessionTranslations = thid.modelFor('language.DE');
		this.sessionWords = this.getSessionWordsForTranslations(sessionTranslations);
		return this.requestExamWords(sessionWords);
	}
});