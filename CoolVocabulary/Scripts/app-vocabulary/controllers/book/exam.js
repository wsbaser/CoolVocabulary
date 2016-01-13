var MAX_LEARN_LEVEL = 5;
Vocabulary.BookExamController = Ember.Controller.extend(Vocabulary.HasActiveObject, {
	collection: Ember.computed.alias('sessionWords'),
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
			var userBook = this.get('model');
			// . update exam date
			var examDates = userBook.get('examDates'); 
			examDates[translation.id] = Date.now();
			userBook.notifyPropertyChange('examDates');
			// . update learn level
			if(wordToExam.allCorrect()){
				var learnLevels = userBook.get('learnLevels');
				var level = learnLevels[translation.id] || 0;
				learnLevels[translation.id] = level+1;
				translation.get('bookWord').content.notifyPropertyChange('learnLevel');
			}
			// . save to db
			translation.save();
		}
	},
	checkForMoreWords: function(){
		var DAY = 60*60*24*1000;
		var now = Date.now();
		var bookWords = this.get('model.book.bookWords');
		var learnLevels = this.get('model.learnLevels');
		var examDates = this.get('model.examDates');
		var hasMoreWordsToExam = bookWords.any(function(item){
			var translations = item.get('translations').toArray();
			for (var i = translations.length - 1; i >= 0; i--) {
				var learnLevel = learnLevels[translations[i].id]||0;
				var examDate = examDates[translations[i].id]||0;  
			 	if(learnLevel<MAX_LEARN_LEVEL && now-examDate>DAY){
			 		return true;
			 	}
			}
			return false;
		});
		this.set('hasMoreWordsToExam', hasMoreWordsToExam);
		var learnDates = this.get('model.learnDates');
		var hasMoreWordsToLearn = bookWords.any(function(item){
			return !learnDates[item.id];
		});
		this.set('hasMoreWordsToLearn', hasMoreWordsToLearn);
	},
	checkForPromotes: function(){
		var translationsToPromote = Ember.A();
		this.get('sessionWords').forEach(function(wordToLearn){
			if(wordToLearn.allCorrect()){
				translationsToPromote.pushObject(wordToLearn.get('translation'));
			}
		});
		translationsToPromote = translationsToPromote.uniq();
		var learnLevels = this.get('model.learnLevels');
		var dict = {};
		translationsToPromote.forEach(function(translation){
			var learnLevel = learnLevels[translation.id];
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