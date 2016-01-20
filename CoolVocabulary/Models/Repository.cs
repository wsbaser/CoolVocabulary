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

        internal async Task<MonthStatisticDto> GetMonthStatisticAsync(string userId, LanguageType languageType) {
            MonthStatisticDto statisticDto = Redis.GetMonthStatistic(userId, languageType);
            if (statisticDto == null) {
                MonthStatistic statistic = await _db.GetThisMonthStatisticAsync(userId, languageType);
                if (statistic == null) {
                    var plan = CalculateMonthPlan(userId, languageType);
                    statistic = await _db.CreateMonthStatisticAsync(userId, languageType, plan);
                }
                statisticDto = new MonthStatisticDto(statistic);
            }
            return statisticDto;
        }

        private object CalculateMonthPlan(string userId, LanguageType languageType) {
            throw new NotImplementedException();
        }
    }
}