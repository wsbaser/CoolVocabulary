window.CARD_HEIGHT = 300;

Vocabulary.WordToLearn = Ember.Object.extend({
	word: null,
	bookWords: [],
	wordTranslations: null,
	learnedAt: null,
	addBookWord: function(bookWord){
		this.set('learnedAt', bookWord.get('learnedAt'));
		this.get('bookWords').push(bookWord);
	},
	currentCard: null,
	cards: []
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
	// function(index){
	// 	if(index<0 || index>(this.get('cards').length-1))
	// 		return;
	// 	this.set('cardIndex',index);
	// 	console.log('scoll to card index: '+ index);
	// },
});