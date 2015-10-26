Vocabulary.WordDetailsEventsComponent = Ember.Component.extend({
	didInsertElement: function(){
		$('#word_details_popover').on('mouseout', this, this.closePopover);
		$('.show-details.active').on('mouseout', this, this.closePopover);
	},
	closePopover: function(event){
		var self = event.data;
		var $rt = $(event.relatedTarget);
		if($rt.closest('#word_details_popover').length||
			$rt.closest('.show-details.active').length){
			return;
		}
		self.get('onMouseOut')();
	},
	willDestroyElement: function(){
		$('#word_details_popover').off('mouseout', this.closePopover);
		$('.show-details.active').off('mouseout', this.closePopover);	
	}
});