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
		var translation = wordToExam.get('translation');
		if(wordToExam.allExamined()){
			translation.set('examinedAt', Date.now());
		}
		if(wordToExam.allCorrect()){
			translation.incrementProperty('learnLevel');
			translation.get('bookWord').content.notifyPropertyChange('learnLevel');
			// /translation.get('bookWord').content.updateLearnLevel();
		}
		if(translation.get('hasDirtyAttributes')){
			translation.save();
		}
	},
	checkForMoreWords: function(){
		var bookWords = this.get('model.bookWords');
		var DAY = 60*60*24*1000;
		var now = Date.now();
		var hasMoreWords = bookWords.any(function(item){
			var translations = item.get('translations').toArray();
			for (var i = translations.length - 1; i >= 0; i--) {
			 	if((now-translations[i].get('examinedAt'))>DAY){
			 		return true; 
			 	}
			}
			return false;
		});
		this.set('hasMoreWords', hasMoreWords);
	},
	checkForPromotes: function(){
		var translationsToPromote = Ember.A();
		this.get('sessionWords').forEach(function(wordToLearn){
			if(wordToLearn.allCorrect()){
				translationsToPromote.pushObject(wordToLearn.get('translation'));
			}
		});
		translationsToPromote = translationsToPromote.uniq();
		var dict = {};
		translationsToPromote.forEach(function(translation){
			var learnLevel = translation.get('learnLevel');
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
		examine: function(){
			this.send("sessionChanged");
		}
	}
});