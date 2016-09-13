Vocabulary.LearnHotkeysComponent = Ember.Component.extend({
	classNames: ['hidden'],
	//examCtrl: Ember.inject.controller('book.exam'),
	didInsertElement: function(){
		///$('body').on('keydown', this, this.onKeyDown);
	},
	// onKeyDown: function(e){
	// 	var self = e.data;
	// 	var isSummary = self.get('examCtrl.isSummary'); 
	// 	if(!isSummary){
	// 		switch(e.keyCode){
	// 			case 32:
	// 				self.get('onPlaySound')();
	// 				return false;
	// 		}
	// 	}
	// },
	willDestroyElement: function(){
		$('body').off('keydown', this.onKeyDown);
	}
});