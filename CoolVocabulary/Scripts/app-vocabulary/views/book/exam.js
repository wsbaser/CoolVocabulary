Vocabulary.BookExamView = Ember.Component.extend({
	didInsertElement: function(){
		$('body').addClass('exam');
	},
	willDestroyElement: function(){
		$('body').removeClass('exam');	
	}
});