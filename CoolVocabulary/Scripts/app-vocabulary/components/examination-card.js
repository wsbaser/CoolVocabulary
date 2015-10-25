Vocabulary.ExaminationCardComponent = Ember.Component.extend({
	classNames: ['examination-card', 'light-shadow'],
	actions: {
		select: function(translation){
			console.log('translation selected: ' + translation);
		}
	}
});