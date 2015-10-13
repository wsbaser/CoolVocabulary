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
		Ember.run.schedule('destroy', this, this.destroy);
	},
	// closePopover: function(event){
	// 	var $rt = $(event.relatedTarget);
	// 	if($rt.find('#word_details_popover').length||
	// 		$rt.find('.show-details.active').length){
	// 		return;
	// 	}
	// 	this.transitionTo('book');
	// },
	afterRender: function(){
		var self = this;
		var popoverEl = $('#word_details_popover');
		// . initialize popover
		popoverEl.modalPopover({
		    target: '.show-details.active',
		    placement: 'bottom',
		    backdrop: false,
		    animation: true,
		    keyboard: true
		});

		// . set popover width
		popoverEl.css('width', ($('.sp-block').width()-10)+'px');

		// . show popover
		popoverEl.modalPopover('show');

		// popoverEl.on('mouseout', this.closePopover.bind(this));
		// $('.show-details.active').on('mouseout', this.closePopover.bind(this));

		// . listen for events to hide "Word Details" popover
		// popoverEl.on('blur', function(){
		// 	self.transitionTo('book');
		// });
	}
});