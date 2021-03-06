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
		cards.pushObjects(this.generateDefinitionCards(cardsJson));
		cards.pushObjects(this.generateExampleCards(cardsJson));
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
		// . generate "activateLearnigCard" event	
		$(window).trigger('activateLearningCard', [
			this.get('word.id'), 
			this.get('cards').indexOf(card)]);
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
