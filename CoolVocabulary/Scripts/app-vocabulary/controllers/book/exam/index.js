var MAX_LEARN_LEVEL = 5;
Vocabulary.BookExamIndexController = Ember.Controller.extend(Vocabulary.HasActiveObject, {
	languageCtrl: Ember.inject.controller('language'),
	options: Ember.computed.alias('parentCtrl.options'),
	isSingleBook: Ember.computed('options', function(){
		return !!this.get('options.userBook');
	}),
	collection: Ember.computed.alias('model'),
	activeWord: Ember.computed.alias('activeObject'),
	activateFirstWord: function(){
		this.activateFirstObject();
	},
	isLastWord: Ember.computed.alias('isLastObject'),
	scrollToNextWord: function(){
		this.set('isScrolling', true);
		var scrollOffset = '+=' + CARD_HEIGHT + 'px';
		$('#learning-cards-shadow').scrollTo(scrollOffset, {onAfter:function(){
			this.set('isScrolling', false);
		}.bind(this)});
		$('#learning-cards').scrollTo(scrollOffset);
	},
	updateExaminationStatus: function(wordToExam){
		wordToExam.set('isExamined', true);
		if(wordToExam.allExamined()){
			var translation = wordToExam.get('translation');			
			var userBook = translation.get('bookWord.book.userBook');
			// . update exam date
			var examDates = userBook.get('examDates'); 
			examDates[translation.id] = Date.now();
			userBook.notifyPropertyChange('examDates');
			if(wordToExam.allCorrect()){
				// . update learn level
				var learnLevels = userBook.get('learnLevels');
				var level = learnLevels[translation.id] || 0;
				level++;
				learnLevels[translation.id] = level;
				userBook.notifyPropertyChange('learnLevels');
				// . update promote date
				var promoteDates = userBook.get('promoteDates');
				if(!promoteDates[translation.id]){
					promoteDates[translation.id] = [];
				}
				var arr = promoteDates[translation.id];
				arr[level] = Date.now();
				userBook.notifyPropertyChange('promoteDates');
				translation.get('bookWord').content.notifyPropertyChange('learnLevel');
			}
			userBook.content.save();

			// . recalculate days
			this.get('languageCtrl').notifyPropertyChange('days');
			this.get('languageCtrl').updateLanguageBooksInCT();
		}
	},
	checkForMoreWords: function(){
		var languageCtrl = this.get('languageCtrl');
		var userBook = this.get('options.userBook'); 
		var active = userBook?
			languageCtrl.getActiveTranslations(userBook):
			languageCtrl.getAllActiveTranslations();

		// var DAY = 60*60*24*1000;
		// var now = Date.now();
		// var bookWords = this.get('model.book.bookWords');
		// var learnLevels = this.get('model.learnLevels');
		// var examDates = this.get('model.examDates');
		// var hasMoreWordsToExam = bookWords.any(function(item){
		// 	var translations = item.get('translations').toArray();
		// 	for (var i = translations.length - 1; i >= 0; i--) {
		// 		var learnLevel = learnLevels[translations[i].id]||0;
		// 		var examDate = examDates[translations[i].id]||0;  
		// 	 	if(learnLevel<MAX_LEARN_LEVEL && now-examDate>DAY){
		// 	 		return true;
		// 	 	}
		// 	}
		// 	return false;
		// });

		this.set('hasMoreWordsToExam', !!active.inProgress.length);
		// var learnDates = this.get('model.learnDates');
		// var hasMoreWordsToLearn = bookWords.any(function(item){
		// 	return !learnDates[item.id];
		// });
		this.set('hasMoreWordsToLearn', !!active.waiting.length);
	},
	checkForPromotes: function(){
		var translationsToPromote = Ember.A();
		this.get('model').forEach(function(wordToLearn){
			if(wordToLearn.allCorrect()){
				translationsToPromote.pushObject(wordToLearn.get('translation'));
			}
		});
		translationsToPromote = translationsToPromote.uniq();
		var learnLevels = this.get('model.learnLevels');
		var dict = {};
		translationsToPromote.forEach(function(translation){
			var userBook = translation.get('bookWord.book.userBook');
			var learnLevels = userBook.get('learnLevels'); 
			var learnLevel = learnLevels[translation.id]||0;
			if(!dict[learnLevel]){
				dict[learnLevel]=1;
			}
			else{
				dict[learnLevel]++;	
			}
		});
		var promotes = Ember.A();		
		for(var learnLevel in dict){
			promotes.pushObject(Ember.Object.create({
				level: learnLevel,
				count: dict[learnLevel],
				examinationsCompleted: +learnLevel===MAX_LEARN_LEVEL
			}));
		}
		this.set('promotes', promotes.sortBy('count'));
	},
	actions: {
		nextWord: function(){
			if(this.get('isScrolling')){
				return;
			}
			this.updateExaminationStatus(this.get('activeWord'));
			this.scrollToNextWord();
			if(this.get('isLastObject')){
				this.checkForMoreWords();
				this.checkForPromotes();
				this.set('isSummary',true);
			}
			else {
				setTimeout(function(){
					this.nextObject();
					this.get('activeWord').playSound();
				}.bind(this), SCROLL_TIME);
			}
		},
		changeSession: function(){
			this.send('sessionChanged');
		},
		learnMore: function(){
			this.transitionToRoute('book.learn', 0);
		}
	}
});

Vocabulary.LanguageDEExamController = Vocabulary.BookExamIndexController;