Vocabulary.ApplicationRoute = Ember.Route.extend({
	setupController: function(controller, model){
	    this._super(controller, model);
	    var self = this;
	    Ember.run.schedule('afterRender', this, function () {
	    	console.log("application after render");
	    	$(window).resize(function(){
				self.setContentHeight();
			}.bind(this));
			self.setContentHeight();
	    });
	},
	setContentHeight: function(){
		var height = $(window).height()-$('#toolbox').height()-35;
		console.log('setContentHeight');
		$('#content').css('height',height+'px');
		var heightChangedEvent = new CustomEvent("heightChanged", {detail: height});
		$('#content')[0].dispatchEvent(heightChangedEvent);
	}
});