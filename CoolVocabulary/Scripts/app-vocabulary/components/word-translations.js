Vocabulary.WordTranslationsComponent = Ember.Component.extend({
	actions:{
		remove: function(translation){
			if(confirm('Remove this translation?')){
				translation.destroyRecord().then(function(){
					this.get('onTranslationRemoved')();
				}.bind(this));
			}
		}
	}
});