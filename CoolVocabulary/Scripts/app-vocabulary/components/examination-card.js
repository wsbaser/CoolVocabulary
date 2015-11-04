Vocabulary.ExaminationCardComponent = Ember.Component.extend({
	classNames: ['examination-card', 'light-shadow'],	
	actions: {
		select: function(translation){
			var wordToExam = this.get('wordToExam');
			var selectedWord = translation.get('word');
			var correctWord = wordToExam.get('targetWord');
			if(selectedWord===correctWord){
				translation.set('isCorrect', true);
			}
			else{
				translation.set('isMistake', true);
				wordToExam.set('isMistake', true);
				var translations = wordToExam.get('translations');
				for (var i = translations.length - 1; i >= 0; i--) {
					if(translations[i].get('word')===correctWord){
						translations[i].set('isCorrect', true);
						break;
					}
				}
			}
			setTimeout(function(){
				this.get('onSelect')();
			}.bind(this), 1000);
		}
	}
});