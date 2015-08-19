Vocabulary.ApplicationController = Ember.Controller.extend({
	userName: 'wsbaser',
	langPair: { sourceLang:'en', targetLang:'ru' },
	book: 'Stranger in a strange land',
	init: function(){
		var self = this;
		$(document).ready(function(){
			$(window).resize(function(){
				self.setContentHeight();
			}.bind(this));
			self.setContentHeight();
		});
	}.on('init'),
	setContentHeight: function(){
		var height = $(window).height()-$('#toolbox').height();
		console.log('setContentHeight');
		$('#content').css('height',height+'px');
		var heightChangedEvent = new CustomEvent("heightChanged", {detail: height});
		$('#content')[0].dispatchEvent(heightChangedEvent);
	}
});
