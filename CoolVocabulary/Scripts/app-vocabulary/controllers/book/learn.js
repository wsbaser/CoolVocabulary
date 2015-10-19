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
	type: null,
	wordToLearn: null,
	serviceType: null,
	data: null
});

Vocabulary.WordToLearn = Ember.Object.extend({
	word: null,
	bookWords: Ember.A(),
	wordTranslations: null,
	cards: Ember.A(),
	learnedAt: null,
	currentCard: null,
	addBookWord: function(bookWord){
		this.set('learnedAt', bookWord.get('learnedAt'));
		this.get('bookWords').pushObject(bookWord);
	},
	myObserver: function(){
		console.log('wordTranslations observer');
	}.observes('wordTranslations'),
	setWordTranslations: function(wordTranslations){
		// . set wordTranslations property
		this.set('wordTranslations', wordTranslations);
		// . generate cards
		var cards = this.get('cards');
		var translationCards = JSON.parse(wordTranslations.get('translationCards'));
		cards.pushObject(Vocabulary.WordCard.create({
			type: CardTypes.MAIN,
			WordToLearn: this
		}));
		cards.pushObject(Vocabulary.WordCard.create({
			type: CardTypes.TRANSLATIONS,
			serviceType: ServiceTypes.GOOGLE,
			WordToLearn: this
		}));
		cards.pushObjects(this.generateExampleCards());
		cards.pushObjects(this.generateDefinitionCards());
		this.set('cards', cards);
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