function DECalculator(){
};

DECalculator.DAILY_PROMOTES_PLAN = 15;
DECalculator.MAX_LEARN_LEVEL = 5;

DECalculator.prototype.DENotCompleted = function(userBooks){
	return this.getPromotesCount(userBooks, new Date()) < DECalculator.DAILY_PROMOTES_PLAN;
};

DECalculator.prototype.getPromotesCount = function(userBooks, day){
	// . calculate amount of translations with lastPromotedDate equal to the specific day
	var promotesCount = 0;
	userBooks.forEach(function(userBook){
		var promoteDates = userBook.promoteDates; 
		for(var translationId in promoteDates){
			var arr = promoteDates[translationId];
			for (var i = arr.length - 1; i >= 0; i--) {
				if(promoteDates[translationId][i]){
					var promoteDate = new Date(promoteDates[translationId][i]);
					if( promoteDate.getFullYear()===day.getFullYear() && 
						promoteDate.getMonth()===day.getMonth() &&
						promoteDate.getDate()===day.getDate()){
						promotesCount++;
					}
				}
			}
		}
	});
	return promotesCount;
};

DECalculator.prototype.hasDE = function(userBooks){
	var active = this.getAllActiveTranslations(userBooks);
	return !!active.inProgress.length || !!active.waiting.length;
};

DECalculator.prototype.getAllActiveTranslations = function(userBooks){
	var self = this;
	var inProgress = [];
	var waiting = [];
	userBooks.forEach(function(userBook){
		var activeTranslations = self.getActiveTranslations(userBook);
		inProgress = inProgress.concat(activeTranslations.inProgress);
		waiting = waiting.concat(activeTranslations.waiting);
	});
	return {
		inProgress: inProgress,
		waiting: waiting	
	};
};

DECalculator.prototype.getActiveTranslations = function(userBook){
	var bookWordToTranlsations = userBook.translations||{};
	var learnLevels = userBook.learnLevels||{};
	var learnDates = userBook.learnDates||{};
	var examDates = userBook.examDates||{};

	var DAY = 60*60*24*1000;
	var now = Date.now();
	var notExaminedTodayFilter = function(id){ return (now-(examDates[id]||0))>DAY;  };
	var notCompletedFilter = function(id){ return (learnLevels[id]||0)<DECalculator.MAX_LEARN_LEVEL; };
	var canBeExaminedFilter = function(id){ return notExaminedTodayFilter(id)&&notCompletedFilter(id); };
	var inProgress = [];
	var waiting = [];
	for(var bookWordId in bookWordToTranlsations){
		var translationIds = bookWordToTranlsations[bookWordId];
		var learnedAt = learnDates[bookWordId];
		var notCompleted = translationIds.filter(canBeExaminedFilter);
		if(learnedAt){
			inProgress = inProgress.concat(notCompleted);
		}else{
			waiting = waiting.concat(notCompleted);
		}
	}
	return {
		inProgress: inProgress,
		waiting: waiting
	};
};