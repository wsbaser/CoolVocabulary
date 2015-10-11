Vocabulary.LearnComponent = Ember.Component.extend({
	didInsertElement: function(){
		var self = this;
		$('#content')[0].addEventListener('heightChanged', function(){
			var offset = CARD_HEIGHT-$('.stencil>.top-block').height();
			console.log('scroll cards shadow to ' + offset);
			$('.learning-cards-shadow').scrollTop(offset);
		});
		$('.learning-col').bind('mousewheel', function(event) {
			self.get('controller').showNeighbourCard(event.originalEvent.wheelDeltaY>0?-1:1);
			return true;
		});
	},
	willRemoveElement:function(){
		$('.learning-col').unbind('mousewheel');
	}
});