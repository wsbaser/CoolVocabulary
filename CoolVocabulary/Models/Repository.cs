using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace CoolVocabulary.Models {
    public class Repository {
        VocabularyDbContext _db;
        public Repository(VocabularyDbContext db) {
            this._db = db;
        }

        internal async Task<MonthPlanDto> GetMonthPlanDtoAsync(string userId, LanguageType languageType) {
            MonthPlanDto statisticDto = Redis.GetMonthPlan(userId, languageType);
            if (statisticDto == null) {
                MonthPlan monthPlan = await _db.GetThisMonthPlanAsync(userId, languageType);
                if (monthPlan == null) {
                    int planedCount = CalculateMonthPlan(userId, languageType);
                    monthPlan = await _db.CreateMonthPlanAsync(userId, languageType, planedCount);
                }
                statisticDto = new MonthPlanDto(monthPlan);
            }
            return statisticDto;
        }

        private UInt16 CalculateMonthPlan(string userId, LanguageType languageType) {
            var daysInMonth = DateTime.DaysInMonth(DateTime.Today.Year, DateTime.Today.Month);
            const int PLAN_PER_DAY = 3;
            return (UInt16)(PLAN_PER_DAY * daysInMonth);
        }
    }
}