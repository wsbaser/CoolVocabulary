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

        public async Task<dynamic> GetUserCTDataAsync(ApplicationUser user) {
            var userBooksDto = await _db.GetUserBooksDtoAsync(user.Id, null);
            dynamic books = userBooksDto.Select(ub => new {
                id = ub.book,
                userBookId = ub.id,
                userId = ub.user,
                authorId = ub.BookDto.user,
                name = ub.BookDto.name,
                language = ub.BookDto.language,
                learnLevels = ub.learnLevels,
                learnDates = ub.learnDates,
                examDates = ub.examDates,
                promoteDates = ub.promoteDates,
                translations = ub.translations
            }).ToList();
            return new {
                isAuthenticated = true,
                languages = SupportedLanguages.AllDto,
                user = new {
                    id = user.Id,
                    name = user.DisplayName,
                    language = ((LanguageType)user.NativeLanguage).ToString(),
                    books = books
                }
            };
        }
    }
}