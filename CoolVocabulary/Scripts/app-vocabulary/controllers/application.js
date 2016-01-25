Vocabulary.ApplicationController = Ember.Controller.extend({
	init: function(){
		this.set('CTAdapter', new CTAdapter());
		this._super();
	}
});