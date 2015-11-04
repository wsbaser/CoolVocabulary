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
			if(this.get('isLastObject')){
				var bookWords = this.get('model.bookWords');
				var DAY = 60*60*24*1000;
				var now = Date.now();
				var hasMoreWords = bookWords.any(function(item){ 
					var examinedAt = item.get('examinedAt') || 0;
					return (now-examinedAt)>DAY;
				});
				this.set('hasMoreWords', hasMoreWords);
				this.set('isSummary',true);
			}
			else {
				setTimeout(function(){
					this.nextObject();
				}.bind(this), SCROLL_TIME);
			}
		},
		examine: function(){
			this.send("sessionChanged");
		}
	}
});