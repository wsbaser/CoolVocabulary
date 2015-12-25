Vocabulary.WordTranslationRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('language/wordTranslation', { into: "language/book", outlet: 'wordTranslation' });
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
		var popoverEl = $('#word_details_popover');
		
		// . initialize popover
		popoverEl.modalPopover({
		    target: '.show-details.active',
		    placement: 'bottom',
		    backdrop: false,
		    animation: true,
		    keyboard: false
		});

		// . set popover width
		popoverEl.css('width', ($('.sp-block').width()-25)+'px');

		// . show popover
		popoverEl.modalPopover('show');
		//popoverEl.removeClass('closed')
		popoverEl.removeClass('fadeout').addClass('fadein');
	}
});