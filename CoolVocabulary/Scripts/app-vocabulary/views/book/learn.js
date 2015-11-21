Vocabulary.BookLearnView = Ember.Component.extend({
	didInsertElement: function(){
		$('body').addClass('learn');
		this.createShadow();
    	this.setupShadowPosition();
    	$(window).on('resize', this, this.setupShadowPosition);
    	$(window).on('activateLearningCard', this.activateShadowLearningCard);
	},
	activateShadowLearningCard: function(event, wordId, cardIndex){
		var $learningCard = $('#learning-cards-shadow #learning_card_' + wordId).children().each(function(index, item){
			if(index===cardIndex){
				$(item).removeClass('hidden');
			}
			else{
				$(item).addClass('hidden');
			}
		});
	},
	createShadow: function(){
		var nodes = $('#learning-cards').children();
		var $shadow = $('#learning-cards-shadow');
		$shadow.append('<div class="learning-card" style="background: transparent;"></div>');
		$('#learning-cards').children().each(function(index, item){
			$shadow.append($(item).clone());
		});
		$shadow.append('<div class="learning-card" style="background: transparent;"></div>');
	},
	setupShadowPosition: function(event){
		var offset = CARD_HEIGHT-$('#top-block').height();
		console.log('scroll cards shadow to ' + offset);
		$('#learning-cards-shadow').scrollTop(offset);
	},
	willDestroyElement: function(){
		$('body').removeClass('learn');
		$(window).off('resize', this.setupShadowPosition);
    	$(window).off('activateLearningCard', this.activateShadowLearningCard);		
	}
});