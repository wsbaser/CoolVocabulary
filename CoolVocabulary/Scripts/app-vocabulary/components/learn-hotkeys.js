Vocabulary.LearnHotkeysComponent = Ember.Component.extend({
	classNames: ['hidden'],
	learnCtrl: Ember.inject.controller('book.learn'),
	didInsertElement: function(){
		$('body').on('keydown', this, this.onKeyDown);
	},
	onKeyDown: function(e){
		var self = e.data;
		var isSummary = self.get('learnCtrl.isSummary'); 
		if(!isSummary){
			switch(e.keyCode){
				case 37:
					self.get('onPrevCard')();
					return false;
				case 39:
					self.get('onNextCard')();
					return false;
				case 13:
					self.get('onNextWord')();
					return false;
				case 32:
					self.get('onPlaySound')();
					return false;
			}
		}
	},
	willDestroyElement: function(){
		$('body').off('keydown', this.onKeyDown);
	}
});