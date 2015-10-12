Vocabulary.WordSoundComponent = Ember.Component.extend({
	word: null,
	tagName:'span',
	hasSound: Ember.computed('sound', function(){
		return this.get('sound')!==null;
	}),
	sound: Ember.computed('word', function(){
		var soundUrls = this.get('word').get('soundUrls');
		var result = null;
		if(soundUrls){
			// . just getring the first one
			result = soundUrls.split(',')[0];
		}
		return result;
	}),
	didInsertElement: function(){
		this.playSound();
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