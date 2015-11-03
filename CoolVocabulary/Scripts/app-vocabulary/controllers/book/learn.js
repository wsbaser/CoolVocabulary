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


var EXAMPLE_CARDS_COUNT = 3;
var MAX_EXAMPLE_LENGTH = 150;

Vocabulary.WordToLearn = Ember.Object.extend(Vocabulary.HasActiveObject, {
	playSound: function(){
		this.set('playSoundCounter', Math.random());
	},
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
				original: $item.find('.orig>div').html().trim(),
				translation: $item.find('.transl>div').html().trim(),
				sourceOriginal: $item.next().find('.l-examples__lcol').html().trim(),
				sourceTranslation: $item.next().find('.l-examples__rcol').html().trim()
			};
		}).toArray();
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
		// . examples should be short if it possible
		var shortExamples = examples.filter(function(item){
			return item.original.length<MAX_EXAMPLE_LENGTH;
		});
		if(shortExamples.length>=EXAMPLE_CARDS_COUNT){
			examples = shortExamples;
		}
		
		// .examples should be random
		examples = examples.sort(function() { return 0.5 - Math.random(); });

		// .generate example cards
		var cards = [];
		var startIndex = 0;
		var index = 0;
		count = count || EXAMPLE_CARDS_COUNT;
		while(startIndex+1<=examples.length && index++<count){
			cards.push(Vocabulary.WordCard.create({
				type: CardTypes.EXAMPLES,
				serviceType: serviceType,
				wordToLearn: this,
				data: examples.slice(startIndex, startIndex+1)
			}));
			startIndex+=1;
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
		if(cardJson && Object.keys(cardJson).length){
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
	// . HasActiveObject mixin support 
	collection: Ember.computed.alias('cards'),
	activeCard: Ember.computed.alias('activeObject'),
	activateCard: function(card){
		this.activateObject(card);
	},
	activateFirstCard: function(){
		this.activateFirstObject();
	},
	nextCard: function(){
		return this.nextObject();
	},
	prevCard: function(){
		return this.prevObject();
	}
});

var CARD_HEIGHT = 350;	// . 346 because of margin collapse
var SCROLL_TIME = 400;	// мс.

$.extend($.scrollTo.defaults, {
  axis: 'y',
  duration: SCROLL_TIME
});

Vocabulary.BookLearnController = Ember.Controller.extend(Vocabulary.HasActiveObject, {
	book: Ember.inject.controller(),
	init: function(){
		this.set('isSummary',false);
	},
	// . HasActiveObject mixin support 
	collection: Ember.computed.alias('sessionWords'),
	activeWord: Ember.computed.alias('activeObject'),
	activateFirstWord: function(){
		this.activateFirstObject();
		this.get('activeWord').playSound();
	},
	scrollToNextWord: function(){
		this.set('isScrolling', true);
		var scrollOffset = '+=' + CARD_HEIGHT + 'px';
		$('#learning-cards-shadow').scrollTo(scrollOffset,{onAfter:function(){
			this.set('isScrolling', false);
		}.bind(this)});
		$('#learning-cards').scrollTo(scrollOffset);
	},
	actions: {
		nextWord: function(){
			if(this.get('isScrolling')){
				return;
			}
			$('.hotkey-hints').addClass('fadeout');
			var activeWord = this.get('activeWord');
			activeWord.set('isLearned', true);
			this.scrollToNextWord();
			if(this.get('isLastObject')){
				this.set('isSummary', true);
			}
			else{
				setTimeout(function(){
					this.nextObject();
					this.get('activeWord').playSound();
				}.bind(this), SCROLL_TIME);
			}
		},
		nextCard: function(){
			if(!this.get('activeWord').nextCard()){
				this.actions.nextWord.call(this);
			}
		},
		prevCard: function(){
			this.get('activeWord').prevCard();
		},
		playSound: function(){
			this.get('activeWord').playSound();
		},
		examine: function(){
			this.get('book').set('learnSessionWords', this.get('sessionWords'));
			this.transitionToRoute('book.exam');
		}
	}
});