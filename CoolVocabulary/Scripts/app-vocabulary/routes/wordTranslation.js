Vocabulary.WordTranslationRoute = Ember.Route.extend({
	renderTemplate: function() {
		console.log('render wordTranslation template');
		this.render('wordTranslation', { into: "book", outlet: 'wordTranslation' });
	},
	model: function(params){
		model = this.store.peekRecord('bookWord', params.bookWord_id);
		return model;
	},
	setupController: function(controller, model){
		this._super(controller, model);
		Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(){
		var bookWordId = this.modelFor('wordTranslation').id;
		var popoverEl = $('#word_details_popover'); 
		// . initialize popover
		//popoverEl.modalPopover('hide');
		popoverEl.modalPopover({
		    target: '#word_translation_' + bookWordId,
		    placement: 'bottom',
		    backdrop: true,
		    animation: true,
		    keyboard: true
		});

		// . show popover
		popoverEl.modalPopover('show');
	}
});