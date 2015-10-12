Vocabulary.BookIndexRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('book/indexRoot', { outlet: 'root' });
		this.render('book/indexToolbox', { outlet: 'toolbox' });
		this.render('book/index', { outlet: 'content' });
	},
	// model: function(params){
	// 	console.log('model hook is called for BookIndexRoute');
	// },
	setupController: function(controller, model){
		model = this.controllerFor('book').get('model');
	    this._super(controller, model);
	    controller.recalculateWords();
	    controller.initSiteDialog();
	    Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(controller){
		var self = this;
    	$('#content').removeClass('grey');
    	$('#toolbox').removeClass('grey');
      	$('#install_ct_alert').modalPopover({
		    target: '#word_input_form',
		    placement: 'bottom',
		    backdrop: true
		});
		// . listen for messages from CoolTranslator
		window.addEventListener("message", function(event){
			if(event.origin!==window.location.origin ||
				event.data.type!=='addTranslation'){
				return;
			}
			self.get('controller').addTranslation(event.data.book,
				event.data.word,
				event.data.bookWord,
				event.data.translation);
		});
	}
});