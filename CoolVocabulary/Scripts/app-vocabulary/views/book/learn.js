Vocabulary.BookLearnView = Ember.Component.extend({
	didInsertElement: function(){
		$('body').addClass('learn');
    	$(window).on('resize', this, this.setupShadowPosition);
    	this.setupShadowPosition();
	},
	setupShadowPosition: function(event){
		var offset = CARD_HEIGHT-$('#top-block').height();
		console.log('scroll cards shadow to ' + offset);
		$('#learning-cards-shadow').scrollTop(offset);
	},
	willDestroyElement: function(){
		$('body').removeClass('learn');
		$(window).off('resize', this.setupShadowPosition);
	}
});