var DAILY_PROMOTES_PLAN = 15;
Vocabulary.LearningCalendarComponent = Ember.Component.extend({
	classNames: [ 'learning-calendar', 'container', 'block'],	
	month: Ember.computed(function(){
		return new Date().toLocaleString('en-us', { month: "long" }).toUpperCase();
	}),
	days: Ember.computed('userBooks.[]', function(){		
		var days = Ember.A();

		// . what day is it and how much days in this month
		var today = new Date();
		var day = new Date(today.getYear(),today.getMonth(),0);
		var daysInThisMonth = day.getDate();
		var todayDate = today.getDate();

		// . calculate task completeness
		var userBooks = this.get('userBooks');
		for(var i=1; i<=daysInThisMonth; i++){
			day.setDate(i);
			var promotesCount = this.getPromotesCount(userBooks, day);
			var deCompleted = promotesCount >= DAILY_PROMOTES_PLAN;
			var isToday = i===todayDate;
			var isHistory = i<todayDate; 
			days.pushObject(Ember.Object.create({
				date: i,
				isToday: isToday,
				hasDE: isToday && !deCompleted,
				deFailed: isHistory && !deCompleted,
				deCompleted: deCompleted,
				promotesCount: promotesCount,
				promotesLeftCount: DAILY_PROMOTES_PLAN-promotesCount
			}));
		}

		return days;
	}),
	getPromotesCount: function(userBooks, day){
		// . calculate amount of translations with lastPromotedDate equal to the specific day
		var promotesCount = 0;
		userBooks.forEach(function(userBook){
			var lastPromoteDates = userBook.get('lastPromoteDates'); 
			for(var translationId in lastPromoteDates){
				var promoteDate = new Date(lastPromoteDates[translationId]);
				if( promoteDate.getYear()===day.getYear() && 
					promoteDate.getMonth()===day.getMonth() &&
					promoteDate.getDate()===day.getDate()){
					promotesCount++;
				}
			}
		});
		return promotesCount;
	}
});