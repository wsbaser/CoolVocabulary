Vocabulary.WordTranslationsComponent = Ember.Component.extend({
	actions:{
		remove: function(translation){
			var self = this;
			BootstrapDialog.show({
	            title: 'Confirmation is neccessary',
	            message: 'Translation will be removed.',
	            draggable: true,
	            size: BootstrapDialog.SIZE_SMALL,
	            buttons: [{
						label: 'Cancel',
						cssClass: 'modal-cancel',
		                action: function(dialog) {dialog.close();}
	            	},{
		                label: 'OK',
		                action: function(dialog) {
							dialog.close();
							translation.destroyRecord().then(function(){
								self.get('onTranslationRemoved')();
							});
						}
					}],
				onhidden: function(){
					self.get('onModalHidden')();
    			}});
		}
	}
});