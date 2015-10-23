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


var EXAMPLES_PER_CARD = 1;
var EXAMPLE_CARDS_COUNT = 5;

Vocabulary.WordToLearn = Ember.Object.extend({
	statusChanged: Ember.observer('isActive','isLearned', function(){
		return Ember.run.once(this,'setIsHighlighted');
	}),
	setIsHighlighted: function(){
		this.set('isHighlighted', this.get('isActive') || this.get('isLearned'));
	},
	mainCard: Ember.computed('cards.[]', function(){
		return this.get('cards').filterBy('type', CardTypes.MAIN)[0];
	}),
	googleTranslationsCard: Ember.computed('cards.[]', function(){
		return this.getCard(CardTypes.TRANSLATIONS, ServiceTypes.GOOGLE);
	}),
	googleDefinitionsCard: Ember.computed('cards.[]', function(){
		return this.getCard(CardTypes.DEFINITIONS, ServiceTypes.GOOGLE);
	}),
	getCard: function(cardType, serviceType){
		return this.get('cards')
			.filterBy('type', cardType)
			.filterBy('serviceType', serviceType)[0];
	},
	exampleCards: Ember.computed('cards.[]', function(){
		return this.get('cards').filterBy('type', CardTypes.EXAMPLES);
	}),
	addBookWord: function(bookWord){
		this.set('learnedAt', bookWord.get('learnedAt'));
		this.get('bookWords').pushObject(bookWord);
	},
	wordTranslationsObserver: Ember.observer('wordTranslations', function(){
		var cards = this.get('cards');
		var wordTranslations = this.get('wordTranslations');
		var cardsJson = JSON.parse(wordTranslations.get('translationCards'));
		cards.pushObject(Vocabulary.WordCard.create({
			type: CardTypes.MAIN,
			wordToLearn: this,
			isActive: true
		}));
		cards.pushObjects(this.generateTranslationCards(cardsJson));
		cards.pushObjects(this.generateExampleCards(cardsJson));
		cards.pushObjects(this.generateDefinitionCards(cardsJson));
		this.activateFirstCard();
	}),
	setWordTranslations: function(wordTranslations){
		// . set wordTranslations property
		this.set('wordTranslations', wordTranslations);
	},
	generateTranslationCards: function(json){
		var cards = [];
		this.addSimpleCard(cards, json, ServiceTypes.GOOGLE, CardTypes.TRANSLATIONS);
		return cards;
	},
	generateExampleCards: function(json){
		var cards = [];
		var cardJson = this.getCardJson(json, ServiceTypes.ABBY, CardTypes.EXAMPLES);
		if(cardJson){
			cards.pushObjects(this.generateAbbyExampleCards(cardJson));
		}
		if(cards.length<EXAMPLE_CARDS_COUNT){
			cardJson = this.getCardJson(json, ServiceTypes.GOOGLE, CardTypes.EXAMPLES);
			if(cardJson){
				cards.pushObjects(this.generateGoogleExampleCards(cardJson));
			}
		}
		return cards.slice(0, EXAMPLE_CARDS_COUNT);
	},
	generateAbbyExampleCards: function(cardJson){
		var all = $(cardJson).find('.js-examples-table-trans').map(function(index, item){
			var $item = $(item);
			return {
				original: $item.find('.orig>div').html(),
				translation: $item.find('.transl>div').html(),
				sourceOriginal: $item.next().find('.l-examples__lcol').html(),
				sourceTranslation: $item.next().find('.l-examples__rcol').html()
			};
		});
		return this.generateRandomExampleCards(all, ServiceTypes.ABBY);
	},
	generateGoogleExampleCards: function(cardJson){
		var all = cardJson.map(function(item){
			return {
				original: item
			};
		});
		return this.generateRandomExampleCards(all, ServiceTypes.GOOGLE);
	},
	generateRandomExampleCards: function(examples, serviceType, count){
		var cards = [];
		examples = examples.sort(function() { return 0.5 - Math.random(); });
		var startIndex = 0;
		var index = 0;
		count = count || EXAMPLE_CARDS_COUNT;
		while(startIndex+EXAMPLES_PER_CARD<=examples.length && index++<count){
			cards.push(Vocabulary.WordCard.create({
				type: CardTypes.EXAMPLES,
				serviceType: serviceType,
				wordToLearn: this,
				data: examples.slice(startIndex, startIndex+EXAMPLES_PER_CARD)
			}));
			startIndex+=EXAMPLES_PER_CARD;
		}
		return cards;
	},
	generateDefinitionCards: function(json){ 
		var cards = [];
		this.addSimpleCard(cards, json, ServiceTypes.GOOGLE, CardTypes.DEFINITIONS);
		return cards;
	},
	addSimpleCard: function(cards, json, serviceType, cardType){
		var cardJson = this.getCardJson(json, serviceType, cardType);
		if(cardJson){
			cards.push(Vocabulary.WordCard.create({
				type: cardType,
				serviceType: serviceType,
				wordToLearn: this,
				data: cardJson
			}));
		}
	},
	getCardJson: function(json, serviceType, cardType){
		var serviceJson = json[serviceType]; 
		return serviceJson?
			serviceJson[cardType]:
			null;
	},
	nextCard: function(){
		var nextCardIndex = this.get('activeCardIndex')+1;
		var cards = this.get('cards');
		if(nextCardIndex < cards.length){
			this.set('activeCardIndex', nextCardIndex);
		}
	},
	prevCard: function(){
		var nextCardIndex = this.get('activeCardIndex')-1;
		if(nextCardIndex >=0){
			this.set('activeCardIndex', nextCardIndex);
		}
	},
	activeCard: Ember.computed('activeCardIndex', function(){
		return this.get('cards').objectAt(this.get('activeCardIndex'));
	}),
	activeCard_old: Ember.computed('activeCardIndex_old', function(){
		return this.get('cards').objectAt(this.get('activeCardIndex_old'));		
	}),
	activeCardIndexObserver: Ember.observer('activeCardIndex', function(){
		this.get('activeCard').set('isActive', true);
		var activeCard_old = this.get('activeCard_old');
		if(activeCard_old){
			activeCard_old.set('isActive', false);
		}
		this.set('activeCardIndex_old', this.get('activeCardIndex'));
	}),
	activateCard: function(card){
		var cardIndex = this.get('cards').indexOf(card);
		this.set('activeCardIndex', cardIndex);
	},
	activateFirstCard: function(){
		this.set('activeCardIndex', 0);
	}
});

Vocabulary.BookLearnController = Ember.Controller.extend({
	sessionWords: null,
	activeWord: Ember.computed('activeWordIndex', function(){
		var sessionWords = this.get('sessionWords');
		var activeWordIndex = this.get('activeWordIndex');
		var activeWord = sessionWords.objectAt(activeWordIndex);
		if(activeWord){
			activeWord.set('isActive', true);
		}
		return activeWord;
	}),
	isLastWord: Ember.computed('activeWordIndex', function(){
		var activeWordIndex = this.get('activeWordIndex');
		var sessionWords = this.get('sessionWords');
		return activeWordIndex===(sessionWords.length-1);
	}),
	activateFirstWord: function(){
		this.set('activeWordIndex', 0);
	},
	// showNeighbourCard: function(dir){
	// 	var cardsCount = 3; // this.get('cards').length;
	// 	var index = this.get('curCardIndex')+dir;
	// 	console.log('nextCardIndex: '+index);
	// 	if( index<0 || index>=cardsCount ){
	// 		return;
	// 	}
	// 	this.set('curCardIndex', index);
	// 	var scrollOffset =
	// 		( dir>0 ?
	// 		'+='+CARD_HEIGHT:
	// 		'-='+CARD_HEIGHT)+'px';
	// 	var SCROLL_TIME = 300;	// мс.
	// 	$('.learning-cards-shadow').scrollTo(scrollOffset, SCROLL_TIME);
	// 	$('.learning-cards').scrollTo(scrollOffset, SCROLL_TIME);
	// },
	actions: {
		nextWord: function(){
			var activeWord = this.get('activeWord');
			activeWord.set('isLearned', true);
			activeWord.set('isActive', false);
			this.incrementProperty('activeWordIndex');
			activeWord = this.get('activeWord');
			if(!activeWord){
				this.transitionToRoute('book');
			}
		},
		nextCard: function(){
			this.get('activeWord').nextCard();
		},
		prevCard: function(){
			this.get('activeWord').prevCard();
		}
	}
});