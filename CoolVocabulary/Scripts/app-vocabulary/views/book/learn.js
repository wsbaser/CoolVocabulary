Vocabulary.BookLearnView = Ember.Component.extend({
	didInsertElement: function(){
		$('body').addClass('learn');
	},
	willDestroyElement: function(){
		$('body').removeClass('learn');	
	}
});