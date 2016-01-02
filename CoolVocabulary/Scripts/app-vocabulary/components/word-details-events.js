Vocabulary.WordDetailsEventsComponent = Ember.Component.extend({
	didInsertElement: function(){
		$(document).on('mousemove', this.get('onMouseMove'));
	},
	willDestroyElement: function(){
		var popoverEl = $('#word_details_popover');
		popoverEl.modalPopover('hide');
		$(document).off('mousemove', this.get('onMouseMove'));
	}
});