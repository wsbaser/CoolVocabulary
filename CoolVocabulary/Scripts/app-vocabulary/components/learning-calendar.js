var DAILY_PROMOTES_PLAN = 15;
Vocabulary.LearningCalendarComponent = Ember.Component.extend({
	classNames: [ 'learning-calendar', 'container', 'block'],	
	month: Ember.computed(function(){
		return new Date().toLocaleString('en-us', { month: "long" }).toUpperCase();
	})
});