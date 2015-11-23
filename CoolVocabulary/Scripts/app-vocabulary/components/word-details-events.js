Vocabulary.WordDetailsEventsComponent = Ember.Component.extend({
	didInsertElement: function(){
		$('#word_details_popover').on('mouseout', this, this.closePopover);
		$('.show-details.active').on('mouseout', this, this.closePopover);
	},
	closePopover: function(event){
		var self = event.data;
		var $rt = $(event.relatedTarget);
		if($rt.closest('#word_details_popover').length||
			$rt.closest('.active').length){
			return;
		}
		self.get('onMouseOut')();
	},
	willDestroyElement: function(){
		var popoverEl = $('#word_details_popover');
		popoverEl.modalPopover('hide');
		popoverEl.off('mouseout', this.closePopover);
		$('.show-details.active').off('mouseout', this.closePopover);	
	}
});