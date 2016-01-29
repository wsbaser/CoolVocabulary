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
	thisMonthPlan: Ember.computed('model', function(){
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		return this.get('user.monthPlans').find(function(statistic){ 
			return statistic.get('year')===year && statistic.get('month')===month;
		});
	}),
	hasTranslationsForDE: function(){
		var active = this.getAllActiveTranslations();
		return !!active.inProgress.length || !!active.waiting.length;
	},
	days: Ember.computed('userBooks.[]', function(){		
		var days = Ember.A();
		var hasTranslationsForDE = this.hasTranslationsForDE();

		// . what day is it and how much days in this month
		var today = new Date();
		var day = new Date();
		var daysInThisMonth = new Date(today.getFullYear(),today.getMonth(),0).getDate();
		var todayDate = today.getDate();

		// . calculate task completeness
		var userBooks = this.get('userBooks');
		for(var i=1; i<=daysInThisMonth; i++){
			day.setDate(i);
			var promotesCount = this.getPromotesCount(userBooks, day);
			var deCompleted = promotesCount >= DAILY_PROMOTES_PLAN;
			var isToday = i===todayDate;
			var isHistory = i<todayDate;
			days.pushObject(Ember.Object.create({
				date: i,
				isToday: isToday,
				hasDE: isToday && !deCompleted && hasTranslationsForDE,
				deFailed: isHistory && !deCompleted,
				deCompleted: deCompleted,
				promotesCount: promotesCount,
				promotesLeftCount: DAILY_PROMOTES_PLAN-promotesCount
			}));
		}

		return days;
	}),
	getPromotesCount: function(userBooks, day){
		// . calculate amount of translations with lastPromotedDate equal to the specific day
		var promotesCount = 0;
		userBooks.forEach(function(userBook){
			var promoteDates = userBook.get('promoteDates'); 
			for(var translationId in promoteDates){
				var arr = promoteDates[translationId];
				for (var i = arr.length - 1; i >= 0; i--) {
					if(promoteDates[translationId][i]){
						var promoteDate = new Date(promoteDates[translationId][i]);
						if( promoteDate.getFullYear()===day.getFullYear() && 
							promoteDate.getMonth()===day.getMonth() &&
							promoteDate.getDate()===day.getDate()){
							promotesCount++;
						}
					}
				}
			}
		});
		return promotesCount;
	},
	examDatesAll: Ember.computed(function(){
		var examDatesAll = {};
		var userBooks = this.get('userBooks');
		userBooks.forEach(function(userBook){
			var examDates = userBook.get('examDates');
			for(var translationId in examDates){
				examDatesAll[translationId] = examDates[translationId];
			}
		});
		return examDatesAll;
	}),
	getAllActiveTranslations: function(){
		var self = this;
		var inProgress = [];
		var waiting = [];
		var userBooks = this.get('userBooks');
		userBooks.forEach(function(userBook){
			var activeTranslations = self.getActiveTranslations(userBook);
			inProgress = inProgress.concat(activeTranslations.inProgress);
			waiting = waiting.concat(activeTranslations.waiting);
		});
		return {
			inProgress: inProgress,
			waiting: waiting	
		};
	},
	getActiveTranslations: function(userBook){
		var bookWordToTranlsations = userBook.getBookWordToTranslations();
		var learnLevels = userBook.get('learnLevels');
		var learnDates = userBook.get('learnDates');
		var examDates = userBook.get('examDates');

		var now = new Date();
		var todayStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
		var notExaminedTodayFilter = function(id){ return (examDates[id]||0)<todayStartTime; };
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
			var bookWordToTranslations = userBook.getBookWordToTranslations();
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
		return this.store.peekAll('bookWord').filter(function(item){
			return ids.indexOf(item.get('id'))!==-1 || ids.indexOf(+item.get('id'))!==-1;
		});
	},
	getTranslationsFromStore: function(ids){
		return this.store.peekAll('translation').filter(function(item){
			return ids.indexOf(item.get('id'))!==-1 || ids.indexOf(+item.get('id'))!==-1;
		});
	},
	getSessionTranslations: function(ids, userBook){
		ids = this.sortTranslationsByExamDate(ids, userBook);
		return ids.slice(0, SESSION_WORDS_COUNT); 
	},
	getSessionTranslationsForLearnSessionWords: function(learnSessionWords, userBook){
		var translationIds = [];
		learnSessionWords.forEach(function(sessionWord){
			sessionWord.get('bookWords').forEach(function(bookWord){
				bookWord.get('translations').forEach(function(translation){
					translationIds.push(translation.get('id'));
				});
			});
		});
		var sessionTranslationIds = this.getSessionTranslations(translationIds, userBook);
		return this.getTranslationsFromStore(sessionTranslationIds);
	},
	getLangPairForCT: function(){
		var user = this.get('user');
		return {
			sourceLang: this.get('model.id'),
			targetLang: user.get('nativeLanguage.id')
		};
	},
	getLanguageBooksForCT: function(){
		return this.get('userBooks').map(function(userBook){ 
			return {
				id: userBook.get('book.id'),
				userBookId: userBook.get('id'),
				userId: userBook.get('user.id'),
				authorId: userBook.get('book.user'),
				language: userBook.get('book.language'), 
				name: userBook.get('book.name').trim(),
				learnLevels: userBook.get('learnLevels'),
				learnDates: userBook.get('learnDates'),
				examDates: userBook.get('examDates'),
				promoteDates: userBook.get('promoteDates'),
				translations: userBook.getBookWordToTranslations()
			};
		});
	},
	updateLanguageBooksInCT: function(){
		var ctAdapter = this.get('applicationCtrl.CTAdapter');
		var languageParam = this.get('model.id');
		var booksParam = this.getLanguageBooksForCT();
		ctAdapter.updateLanguageBooks(languageParam, booksParam);
	}
});