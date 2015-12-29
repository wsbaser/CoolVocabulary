Vocabulary.LanguageBookExamView = Ember.Component.extend({
	classNames: ['full-height'],
	didInsertElement: function(){
		$('body').addClass('exam');
		$(window).on('resize', this, this.setupShadowPosition);
    	this.setupShadowPosition();
	},
	setupShadowPosition: function(event){
		var offset = CARD_HEIGHT-$('#top-block').height();
		console.log('scroll cards shadow to ' + offset);
		$('#learning-cards-shadow').scrollTop(offset);
	},
	willDestroyElement: function(){
		$('body').removeClass('exam');
		$(window).off('resize', this.setupShadowPosition);
	}
});