Vocabulary.LanguageBookLearnView = Ember.Component.extend({
	classNames: ['full-height'],
	didInsertElement: function(){
		$('body').addClass('learn');
		this.createShadow();
    	this.setupShadowPosition();
    	$(window).on('resize', this.setupShadowPosition);
    	$(window).on('activateLearningCard', this.activateShadowLearningCard.bind(this));
	},
	activateShadowLearningCard: function(event, wordId, cardIndex){
		this.activateItemElement('#learning-cards-shadow #learning_card_' + wordId+'>.card-tabs','hidden', cardIndex, false);
		this.activateItemElement('#learning-cards-shadow #learning_card_' + wordId+' .cards-navigation','active', cardIndex, true);
	},
	activateItemElement: function(selector, className, elementIndex, add){
		$(selector).children().each(function(index, item){
			var state = index===elementIndex;
			if(!add){
				// . make state==false to remove class from active element
				//   and state==true to add class to others
				state = !state;
			}
			$(item).toggleClass(className, state);
		});
	},
	createShadow: function(){
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