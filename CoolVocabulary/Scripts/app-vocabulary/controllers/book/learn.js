window.CARD_HEIGHT = 300;

CardTypes = {};
CardTypes.MAIN = 'main';
CardTypes.TRANSLATIONS = 'translations';
CardTypes.EXAMPLES = 'examples';
CardTypes.DEFINITIONS = 'definitions';

ServiceTypes = {};
ServiceTypes.LINGUALEO = 'll';
ServiceTypes.GOOGLE = 'google';
ServiceTypes.TFD = 'tfd';
ServiceTypes.ABBY = 'abby';

Vocabulary.WordCard = Ember.Object.extend({
});

Vocabulary.WordToLearn = Ember.Object.extend({
	mainCard: Ember.computed('cards.[]', function(){
		return this.get('cards').filterBy('type', CardTypes.MAIN)[0];
	}),
	googleTranslationsCard: Ember.computed('cards.[]', function(){
		return this.get('cards')
			.filterBy('type', CardTypes.TRANSLATIONS)
			.filterBy('serviceType', ServiceTypes.GOOGLE)[0];
	}),
	// translationCards: Ember.computed('cards.[]', function(){
	// 	return this.get('cards').filterBy('type', CardTypes.TRANSLATIONS);
	// }),
	exampleCards: Ember.computed('cards.[]', function(){
		return this.get('cards').filterBy('type', CardTypes.EXAMPLES);
	}),
	definitionCards: Ember.computed('cards.[]', function(){
		return this.get('cards').filterBy('type', CardTypes.DEFINITIONS);
	}),
	addBookWord: function(bookWord){
		this.set('learnedAt', bookWord.get('learnedAt'));
		this.get('bookWords').pushObject(bookWord);
	},
	onWordTranslationsChanged: function(){
		var cards = this.get('cards');
		var wordTranslations = this.get('wordTranslations');
		var cardsJson = JSON.parse(wordTranslations.get('translationCards'));
		cards.pushObject(Vocabulary.WordCard.create({
			type: CardTypes.MAIN,
			wordToLearn: this
		}));
		cards.pushObjects(this.generateTranslationCards(cardsJson));
		cards.pushObjects(this.generateExampleCards());
		cards.pushObjects(this.generateDefinitionCards());
	}.observes('wordTranslations'),
	setWordTranslations: function(wordTranslations){
		// . set wordTranslations property
		this.set('wordTranslations', wordTranslations);
	},
	generateTranslationCards: function(cardsJson){
		var result = [];
		var googleCards = cardsJson[ServiceTypes.GOOGLE]; 
		if(googleCards){
			var translationCard = googleCards[CardTypes.TRANSLATIONS];
			if(translationCard){
				result.push(Vocabulary.WordCard.create({
					type: CardTypes.TRANSLATIONS,
					serviceType: ServiceTypes.GOOGLE,
					wordToLearn: this,
					data: translationCard
				}));
			}
		}
		return result;
	},
	generateExampleCards: function(){ return []; },
	generateDefinitionCards: function(){ return []; }
});



Vocabulary.BookLearnController = Ember.Controller.extend({
	sessionWords: null,
	showNeighbourCard: function(dir){
		var cardsCount = 3; // this.get('cards').length;
		var index = this.get('curCardIndex')+dir;
		console.log('nextCardIndex: '+index);
		if( index<0 || index>=cardsCount ){
			return;
		}
		this.set('curCardIndex', index);
		var scrollOffset =
			( dir>0 ?
			'+='+CARD_HEIGHT:
			'-='+CARD_HEIGHT)+'px';
		var SCROLL_TIME = 300;	// мс.
		$('.learning-cards-shadow').scrollTo(scrollOffset, SCROLL_TIME);
		$('.learning-cards').scrollTo(scrollOffset, SCROLL_TIME);
	}
});