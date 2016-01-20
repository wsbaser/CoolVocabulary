Vocabulary.LanguageController = Ember.Controller.extend({
	applicationCtrl: Ember.inject.controller('application'),
	user: Ember.computed.alias('applicationCtrl.model'),
	languages: Ember.computed('model', function(){
		// . return list of all languages except selected one
		var currentLanguageId = this.get('model.id');
		var nativeLanguageId = this.get('applicationCtrl.model.nativeLanguage.id');
		return this.store.peekAll("language").filter(function(language){
			return language.id!==currentLanguageId && language.id!==nativeLanguageId;
		});
	}),
	userBooks: Ember.computed('user.userBooks.[]', 'model', function(){
		var userBooks = this.get('user.userBooks');
		var languageId = this.get('model.id');
		return userBooks.filter(function(userBook){
			return userBook.get('book.language')===languageId; 
		});
	}),
	thisMonthStatistic: Ember.computed('model', function(){
		var today = Date.now();
		var year = today.getYear();
		var month = today.getMonth();
		return this.get('user.monthStatistics').find(function(statistic){ 
			return statistic.get('year')===year && statistic.get('month')===month;
		});
	}),
	examDatesAll: Ember.computed(function(){
		var examDatesAll = {};
		var userBooks = this.get('userBooks');
		userBooks.forEach(function(userBook){
			var examDates = userBook.get('examDates');
			for(var translationId in examDates){
				examDatesAll[translationId] = examDates[translationId];
			}
		});
	}),
	getAllActiveTranslations: function(){
		var inProgress = [];
		var waiting = [];
		var userBooks = this.get('userBooks');
		userBooks.forEach(function(userBook){
			var activeTranslations = this.getActiveTranslations(userBook);
			inProgress = inProgress.concat(activeTranslations.inProgress);
			waiting = waiting.concat(activeTranslations.waiting);
		});
		return {
			inProgress: inProgress,
			waiting: waiting	
		};
	},
	getActiveTranslations: function(userBook){
		var bookWordToTranlsations = userBook.get('translations');
		var learnLevels = userBook.get('learnLevels');
		var learnDates = userBook.get('learnDates');
		var examDates = userBook.get('examDates');

		var DAY = 60*60*24*1000;
		var now = Date.now();
		var notExaminedTodayFilter = function(id){ return (now-examDates[id])>DAY;  };
		var notCompletedFilter = function(id){ return (learnLevels[id]||0)<MAX_LEARN_LEVEL; };
		var canBeExaminedFilter = function(id){ return notExaminedTodayFilter(id)&&notCompletedFilter(id); };
		var inProgress = [];
		var waiting = [];
		for(var bookWordId in bookWordToTranlsations){
			var translationIds = bookWordToTranlsations[bookWordId];
			var learnedAt = learnDates[bookWordId];
			var notCompleted = translationIds.filter(canBeExaminedFilter);
			if(learnedAt){
				inProgress = inProgress.concat(notCompleted);
			}else{
				waiting = waiting.concat(notCompleted);
			}
		}
		return {
			inProgress: inProgress,
			waiting: waiting
		};
	},
	sortTranslationsByExamDate: function(translations, userBook){
		var examDates = userBook?
			userBook.get('examDates'):
			this.get('examDatesAll');

		// . and sort
		return translations.sort(function(id1,id2){
			var examinedAt1 = examDates[id1] || 0;
			var examinedAt2 = examDates[id2] || 0;
			return examinedAt1>examinedAt2?1:(examinedAt1===examinedAt2?0:-1);
		});
	},
	getBookWordsForTranslations: function(translationIds){
		var userBooks = this.get('userBooks');
		var bookWordIds = [];
		var containsAny = function(arr1, arr2){
			for (var i = arr2.length - 1; i >= 0; i--) {
				if(arr1.indexOf(arr2[i])!==-1){
					return true;
				}
			}
			return false;
		};
		userBooks.forEach(function(userBook){
			var bookWordToTranslations = userBook.get('translations');
			for(var bookWordId in bookWordToTranslations){
				if(bookWordIds.indexOf(bookWordId)===-1 && 
					containsAny(bookWordToTranslations[bookWordId], translationIds)){
					bookWordIds.push(bookWordId);
				}
			}
		});
		return bookWordIds;
	},
	getBookWordsFromStore: function(ids){
		this.store.peekAll('bookWord').filter(function(item){
			return ids.indexOf(item.get('id'))!==-1;
		});
	},
	getTranslationsFromStore: function(ids){
		this.store.peekAll('translation').filter(function(item){
			return ids.indexOf(item.get('id'))!==-1;
		});
	},
	getSessionTransaltions: function(ids, userBook){
		ids = languageCtrl.sortTranslationsByExamDate(ids, userBook);
		var sessionTranslationIds = ids.slice(0, SESSION_WORDS_COUNT); 
		return languageCtrl.getTranslationsFromStore(sessionTranslationIds);
	}
});