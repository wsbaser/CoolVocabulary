Vocabulary.WordsController = Ember.Controller.extend({
	inputWord: "",
	translator: {},
	applicationCtrl: Ember.inject.controller('application'),
	init: function(){
		this.initSiteDialog();
	}.on('init'),
	initSiteDialog:function(){
		var self = this;
		var ctAdapter =  new CTAdapter();
		this.set('ctAdapter', ctAdapter);
		var langPair = this.get('applicationCtrl').langPair;
		$('#word_input_form').off('submit', this.showInstallCTAlert);
		ctAdapter.initSiteDialog(langPair, '#word_input_form', function(){
			if(ctAdapter.extensionIsActive){
				return;
			}
			$('#word_input_form').on('submit', self.showInstallCTAlert);
		});
	},
	showInstallCTAlert: function(){
		console.log('show popover');
		$('#install_ct_alert').modalPopover('show');
		return false;
	}
});
