window.CARD_HEIGHT = 300;
Vocabulary.BookLearnController = Ember.Controller.extend({
	cards: [],
	curCardIndex: 0,
	sessionBookWords: null,
	setupSession: function(){
		var DAY = 60*60*24*1000;
		var now = Date.now();
		var sessionBookWords = this.get('model.bookWords')
			.filter(function(item){ 
				return now - (item.get('lernedAt') || 0) > DAY; 
			})
			.sortBy('lernedAt').splice(0, 30);
		this.set('sessionBookWords', sessionBookWords);
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