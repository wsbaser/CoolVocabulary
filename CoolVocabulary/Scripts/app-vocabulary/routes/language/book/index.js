Vocabulary.BookIndexRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('language/book/indexRoot', { into: "language/book", outlet: 'root' });
		this.render('language/book/indexToolbox', { into: "language/book", outlet: 'toolbox' });
		this.render('language/book/index', { into: "language/book", outlet: 'content' });
	},
	setupController: function(controller, model){
		// . set model
		model = this.controllerFor('book').get('model');
	    this._super(controller, model);
	    // . init CT
	    var languageCtrl = this.controllerFor('language');
	    languageCtrl.initCT(model);

	    Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(controller){
		var self = this;
      	$('#install_ct_alert').modalPopover({
		    target: '#word_input_form',
		    placement: 'bottom',
		    backdrop: true
		});
       	$('#target_info_alert').modalPopover({
		    target: '#current_target_progress',
		    placement: 'bottom'
		});
		$('#current_target_progress>svg').on('mouseover', function(e){
			$('#target_info_alert').modalPopover('show');
		});
		$('#current_target_progress>svg').on('mouseout', function(e){
			$('#target_info_alert').modalPopover('hide');
		});

		// . listen for messages from CoolTranslator
		window.addEventListener("message", function(event){
			if(event.origin!==window.location.origin ||
				event.data.type!=='addTranslation'){
				return;
			}
			self.get('controller').addTranslation(
				event.data.userBook,
				event.data.book,
				event.data.word,
				event.data.bookWord,
				event.data.translation);
		});
		self.send('adjustHeight');
	}
});