window.CARD_HEIGHT = 300;

Vocabulary.WordToLearn = Ember.Object.extend({
	bookWords: [],
	learnedAt: 0,
	addBookWord: function(bookWord){
		this.set('learnedAt', bookWord.get('learnedAt'));
		this.get('bookWords').push(bookWord);
	},
	currentCard: null,
	cards: []
});

Vocabulary.BookLearnController = Ember.Controller.extend({
	sessionWords: null,
	setupSession: function(){
		// . agregate data
		var wordsDictionary = {};
		var wordsArr = [];
		this.get('model.bookWords').forEach(function(item){
			var word = item.get('word');
			var wordId = word.get('id');
			var wordToLearn = wordsDictionary[wordId];
			if(!wordToLearn){
				wordToLearn = wordsDictionary[wordId] = Vocabulary.WordToLearn.create({ word: word });
			}
			wordToLearn.addBookWord(item);
		});
		for(var wordId in wordsDictionary){
			wordsArr.push(wordsDictionary[wordId]);
		}

		// . filter data
		var DAY = 60*60*24*1000;
		var now = Date.now();
		wordsArr = $.grep(wordsArr, function(item){
			var learnedAt = item.get('learnedAt') || 0;
			return (now-learnedAt)>DAY;
		});

		// . get first 30
		var sessionWords = wordsArr.splice(0, 30);
		this.set('sessionWords', sessionWords);
	},
	showNeighbourCard: function(dir){
		var cardsCount = 3;// this.get('cards').length;
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
	// function(index){
	// 	if(index<0 || index>(this.get('cards').length-1))
	// 		return;
	// 	this.set('cardIndex',index);
	// 	console.log('scoll to card index: '+ index);
	// },
});