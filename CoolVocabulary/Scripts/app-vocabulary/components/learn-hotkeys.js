Vocabulary.LearnHotkeysComponent = Ember.Component.extend({
	classNames: ['hidden'],
	didInsertElement: function(){
		$('body').on('keydown', this, this.onKeyDown);
	},
	onKeyDown: function(e){
		var self = e.data;
		switch(e.keyCode){
			case 37:
				self.get('onPrevCard')();
				break;
			case 39:
				self.get('onNextCard')();
				break;
			case 13:
				self.get('onNextWord')();
				break;
			case 32:
				self.get('onPlaySound')();
				break;
		}
	},
	willDestroyElement: function(){
		$('body').off('keydown', this.onKeyDown);
	}
});