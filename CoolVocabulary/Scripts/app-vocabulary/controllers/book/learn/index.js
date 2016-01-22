var CARD_HEIGHT = 350;	// . 346 because of margin collapse
var SCROLL_TIME = 400;	// мс.

$.extend($.scrollTo.defaults, {
  axis: 'y',
  duration: SCROLL_TIME
});

Vocabulary.BookLearnIndexController = Ember.Controller.extend(Vocabulary.HasActiveObject, {
	languageCtrl: Ember.inject.controller('language'),
	setupSession: function(){
		this.set('isSummary', false);
		this.activateFirstObject();
	},
	options: Ember.computed.alias('parentCtrl.options'),
	// . HasActiveObject mixin support 
	collection: Ember.computed.alias('model'),
	activeWord: Ember.computed.alias('activeObject'),
	scrollToNextWord: function(){
		this.set('isScrolling', true);
		var scrollOffset = '+=' + CARD_HEIGHT + 'px';
		$('#learning-cards-shadow').scrollTo(scrollOffset, {onAfter:function(){
			this.set('isScrolling', false);
		}.bind(this)});
		$('#learning-cards').scrollTo(scrollOffset);
	},
	updateLearnStatus: function(wordToLearn){
		wordToLearn.set('isLearned', true);
		var userBook = wordToLearn.get('bookWords.firstObject.book.userBook');
		var learnDates = userBook.get('learnDates');
		wordToLearn.get('bookWords').forEach(function(bookWord){
			learnDates[bookWord.id] = Date.now();
		});
		userBook.notifyPropertyChange('learnDates');
		userBook.content.save();
		// . recalculate days
		this.get('languageCtrl').notifyPropertyChange('days');
	},
	actions: {
		nextWord: function(){
			if(this.get('isScrolling') || this.get('isSummary')){
				return;
			}
			if(this.get('options.isSingleWord')){
				this.transitionToRoute('book');
			}
			else{
				$('.hotkey-hints').addClass('fadeout');
				this.updateLearnStatus(this.get('activeWord'));
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
			this.get('languageCtrl').set('learnSessionWords', this.get('model'));
			this.transitionToRoute('book.exam');
		}
	}
});

Vocabulary.LanguageDELearnController = Vocabulary.BookLearnIndexController;