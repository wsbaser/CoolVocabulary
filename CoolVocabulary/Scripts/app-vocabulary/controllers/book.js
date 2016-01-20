Vocabulary.BookController = Ember.Controller.extend({
	getActiveBookWordsSortedByLearnDates: function(){
		var userBook = this.get('model');
		var learnDates = userBook.get('learnDates');
		return userBook.get('book.bookWords').filterBy('learnCompleted', false)
			.sort(function(item1, item2){
				var time1 = learnDates[item1.id] || 0;
				var time2 = learnDates[item2.id] || 0;
				return time1>time2?1:(time1===time2?0:-1);
			}).toArray();
	}
});