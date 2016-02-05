'use strict';

const DAILY_PROMOTES_PLAN = 15;
const MAX_LEARN_LEVEL = 5;

export default class DECalculator {
	DENotCompleted(userBooks) {
		return this.getPromotesCount(userBooks, new Date()) < DAILY_PROMOTES_PLAN;
	}

	getPromotesCount(userBooks, day) {
		// . calculate amount of translations with lastPromotedDate equal to the specific day
		var promotesCount = 0;
		userBooks.forEach(function(userBook) {
			var promoteDates = userBook.promoteDates;
			for (var translationId in promoteDates) {
				var arr = promoteDates[translationId];
				for (var i = arr.length - 1; i >= 0; i--) {
					if (promoteDates[translationId][i]) {
						var promoteDate = new Date(promoteDates[translationId][i]);
						if (promoteDate.getFullYear() === day.getFullYear() &&
							promoteDate.getMonth() === day.getMonth() &&
							promoteDate.getDate() === day.getDate()) {
							promotesCount++;
						}
					}
				}
			}
		});
		return promotesCount;
	}

	hasDE(userBooks) {
		var active = this.getAllActiveTranslations(userBooks);
		return !!active.inProgress.length || !!active.waiting.length;
	}

	getAllActiveTranslations(userBooks) {
		var self = this;
		var inProgress = [];
		var waiting = [];
		userBooks.forEach(function(userBook) {
			var activeTranslations = self.getActiveTranslations(userBook);
			inProgress = inProgress.concat(activeTranslations.inProgress);
			waiting = waiting.concat(activeTranslations.waiting);
		});
		return {
			inProgress: inProgress,
			waiting: waiting
		};
	}

	getActiveTranslations(userBook) {
		var bookWordToTranlsations = userBook.translations || {};
		var learnLevels = userBook.learnLevels || {};
		var learnDates = userBook.learnDates || {};
		var examDates = userBook.examDates || {};

		var now = new Date();
		var todayStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
		var notExaminedTodayFilter = function(id) {
			return (examDates[id] || 0) < todayStartTime;
		};
		var notCompletedFilter = function(id) {
			return (learnLevels[id] || 0) < MAX_LEARN_LEVEL;
		};
		var canBeExaminedFilter = function(id) {
			return notExaminedTodayFilter(id) && notCompletedFilter(id);
		};
		var inProgress = [];
		var waiting = [];
		for (var bookWordId in bookWordToTranlsations) {
			var translationIds = bookWordToTranlsations[bookWordId];
			var learnedAt = learnDates[bookWordId];
			var notCompleted = translationIds.filter(canBeExaminedFilter);
			if (learnedAt) {
				inProgress = inProgress.concat(notCompleted);
			} else {
				waiting = waiting.concat(notCompleted);
			}
		}
		return {
			inProgress: inProgress,
			waiting: waiting
		};
	}
}