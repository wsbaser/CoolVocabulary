// . amount of wrong translations for one exam card
var WRONG_TRANSLATIONS_COUNT = 4;
var SESSION_WORDS_COUNT = 15;

Vocabulary.WordToExam = Ember.Object.extend({
	speachPart: Ember.computed.alias('translation.bookWord.speachPart'),
	init: function(){
 		if(this.get('isStraight')){
			this.set('sourceWord', this.get('translation.bookWord.word.value'));
			this.set('targetWord', this.get('translation.value'));
			this.set('sourceLanguage', this.get('translation.bookWord.word.language'));
			this.set('targetLanguage', this.get('translation.language'));
 		}
 		else{
			this.set('sourceWord', this.get('translation.value'));
			this.set('targetWord', this.get('translation.bookWord.word.value'));
			this.set('sourceLanguage', this.get('translation.language'));
			this.set('targetLanguage', this.get('translation.bookWord.word.language'));
 		}
	},
	statusChanged: Ember.observer('isActive','isExamined', function(){
		return Ember.run.once(this,'setIsHighlighted');
	}),
	setIsHighlighted: function(){
		this.set('isHighlighted', this.get('isActive') || this.get('isExamined'));
	},
	setWrongTranslations: function(wrongTranslations){
		// . set wordTranslations property
		if(wrongTranslations && wrongTranslations.length){
			this.set('wrongTranslations', wrongTranslations);
			this.set('isValid', true);	
		}
	},
	translations: Ember.computed('wrongTranslations', function(){
		// . clone wrongTranslations array
		var translations = this.get('wrongTranslations').map(function(item){
			return Ember.Object.create({
				word: item.get('word')
			});
		});
		// . correct translation
		translations.push(Ember.Object.create({
			word: this.get('targetWord')
		}));
		// . shuffle and return
		return translations.shuffle();
	}),
	link: function(wordToLearn){
		this.set('bro', wordToLearn);
		wordToLearn.set('bro', this);
	},
	allCorrect: function(){
		return this.get('isMistake')===false && this.get('bro.isMistake')===false;
	},
	allExamined: function(){
		return this.get('isExamined') && this.get('bro.isExamined');
	}
});
