Vocabulary.LearningCalendarComponent = Ember.Component.extend({
	classNames: [ 'learning-calendar', 'container', 'block'],	
	month: Ember.computed(function(){
		return new Date().toLocaleString('en-us', { month: "long" });
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
			var taskCompleted = this.getIsTaskCompleted(userBooks, day);
			var taskFailed = i<todayDate && !taskCompleted;
			days.pushObject(Ember.Object.create({
				taskCompleted: taskCompleted,
				taskFailed: taskFailed
			}));
		}

		return days;
	}),
	getIsTaskCompleted: function(userBooks, day){
		// . calculate amount of translations with lastPromotedDate equal to the specific day
		var todayPromotesCount = 0;
		userBooks.forEach(function(userBook){
			var lastPromoteDates = userBook.get('lastPromoteDates'); 
			for(var translationId in lastPromoteDates){
				var promoteDate = new Date(lastPromoteDates[translationId]);
				if( promoteDate.getYear()===day.getYear() && 
					promoteDate.getMonth()===day.getMonth() &&
					promoteDate.getDate()===day.getDate()){
					todayPromotesCount++;
				}
			}
		});
		return todayPromotesCount>=15;
	}
});