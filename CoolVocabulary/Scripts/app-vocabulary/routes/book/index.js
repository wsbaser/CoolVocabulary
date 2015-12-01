Vocabulary.BookIndexRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('book/indexRoot', { outlet: 'root' });
		this.render('book/indexToolbox', { outlet: 'toolbox' });
		this.render('book/index', { outlet: 'content' });
	},
	afterModel: function(){
	},
	setupController: function(controller, model){
		model = this.controllerFor('book').get('model');
	    this._super(controller, model);
	    controller.initSiteDialog();
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
			self.get('controller').addTranslation(event.data.book,
				event.data.word,
				event.data.bookWord,
				event.data.translation);
		});

		$(window).resize(function(){
			self.setContentHeight();
		}.bind(this));
		self.setContentHeight();
	},
	setContentHeight: function(){
		var menuHeight = $('#logo_mobile:visible').length?56:35;
		var height = $(window).height()-$('#toolbox').height()-menuHeight;
		$('#content').css('min-height', height+'px');
	}
});