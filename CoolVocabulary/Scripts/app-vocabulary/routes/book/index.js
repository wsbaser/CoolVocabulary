Vocabulary.BookIndexRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('book/indexRoot', { outlet: 'root' });
		this.render('book/indexToolbox', { outlet: 'toolbox' });
		this.render('book/index', { outlet: 'content' });
	},
	setupController: function(controller, model){
		controller.setWords(model.id);
	    this._super(controller, model);
	    Ember.run.schedule('afterRender', this, function() {
	    	console.log('init popover');
	      	$('#install_ct_alert').modalPopover({
			    target: '#word_input_form',
			    placement: 'bottom',
			    backdrop: true
			});
	    });
	}
});