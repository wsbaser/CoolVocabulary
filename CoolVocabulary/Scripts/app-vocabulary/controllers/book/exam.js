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
	actions: {
		nextWord: function(){
			if(this.get('isScrolling')){
				return;
			}
			var activeWord = this.get('activeWord');
			activeWord.set('isExamined', true);
			this.scrollToNextWord();
			setTimeout(function(){
				if(!this.nextObject()){
					this.transitionToRoute('book');
				}
			}.bind(this), SCROLL_TIME);
		}
	}
});