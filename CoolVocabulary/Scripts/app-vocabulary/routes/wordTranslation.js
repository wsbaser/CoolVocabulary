Vocabulary.WordTranslationRoute = Ember.Route.extend({
	renderTemplate: function() {
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
		var self = this;
		var bookWordId = this.modelFor('wordTranslation').id;
		var popoverEl = $('#word_details_popover');
		// . initialize popover
		popoverEl.modalPopover({
		    target: '#word_translation_' + bookWordId,
		    placement: 'bottom',
		    backdrop: false,
		    animation: true,
		    keyboard: true
		});

		// . set popover width
		popoverEl.css('width', ($('.sp-block').width()-10)+'px');

		// . show popover
		popoverEl.modalPopover('show');

		// . listen for events to hide "Word Details" popover
		popoverEl.on('blur', function(){
			self.transitionTo('book');
		});
	}
});