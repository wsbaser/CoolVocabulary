Vocabulary.WordSoundComponent = Ember.Component.extend({
	tagName: 'span',
	hasSound: Ember.computed('word', function(){
		var soundUrls = this.get('word.soundUrls');
		return soundUrls && soundUrls.trim()!=='';
	}),
	sound: Ember.computed('word', function(){
		var soundUrls = this.get('word.soundUrls');
		var result = null;
		if(soundUrls){
			// . just getring the first one
			result = soundUrls.split(',')[0];
		}
		return result;
	}),
	didInsertElement: function(){
		if(this.get('autoPlay')){
			this.playSound();
		}
	},
	playSound: function(){
		if(this.get('hasSound')){
			this.$('audio')[0].play();
		}
	},
	actions: {
		play: function(){
			this.playSound();
		}
	}
});