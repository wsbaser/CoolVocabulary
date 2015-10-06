Vocabulary.BookIndexRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('book/indexRoot', { outlet: 'root' });
		this.render('book/indexToolbox', { outlet: 'toolbox' });
		this.render('book/index', { outlet: 'content' });
	},
	setupController: function(controller, model){
	    this._super(controller, model);
	    controller.initSiteDialog();
	    Ember.run.schedule('afterRender', this, function() {
	    	console.log('init popover');
	    	$('#content').removeClass('grey');
	    	$('#toolbox').removeClass('grey');
	      	$('#install_ct_alert').modalPopover({
			    target: '#word_input_form',
			    placement: 'bottom',
			    backdrop: true
			});
			window.addEventListener("message", function(event){
				if(event.origin!==window.location.origin ||
					event.data.type!=='addTranslation'){
					return;
				}
				controller.addTranslation(event.data.book,
					event.data.word,
					event.data.bookWord,
					event.data.translation);
			});
	    });
	}
});