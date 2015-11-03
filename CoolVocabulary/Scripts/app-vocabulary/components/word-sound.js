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
	playSoundHandler: Ember.observer('playSoundCounter', function(){
		var counter = this.get('playSoundCounter');
		if(counter){
			this.playSound();
		}
	}),
	didInsertElement: function(){
		if(this.get('autoPlay')){
			this.playSound();
		}
	},
	playSound: function(){
		if(this.get('hasSound')){
			var audioEl = this.$('audio')[0];
			if(audioEl){
				audioEl.play();
			}
		}
	},
	actions: {
		play: function(){
			this.playSound();
		}
	}
});