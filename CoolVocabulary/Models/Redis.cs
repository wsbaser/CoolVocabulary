using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace CoolVocabulary.Models {
    public static class Redis {
#if !NO_REDIS
        private static ConnectionMultiplexer _connection = ConnectionMultiplexer.Connect("localhost");
        public static IDatabase Db {
            get {
                return _connection.GetDatabase();
            }
        }

        private static string GetListKey(LanguageType language, SpeachPartType speachPart) {
            return language.ToString() + "_" + speachPart.ToString();
        }
#endif

        public const int MAX_WORDS_LIST_SIZE = 5000;

        public static void DelWords(LanguageType language, SpeachPartType speachPart) {
#if !NO_REDIS
            string key = GetListKey(language, speachPart);
            Db.KeyDelete(key);
#endif
        }

        public static void PushWord(LanguageType language, SpeachPartType speachPart, string word) {
#if !NO_REDIS
            string key = GetListKey(language, speachPart);
            Db.ListLeftPush(key, word);
#endif
        }

        public static async Task<List<string>> GetRandomWordsAsync(LanguageType language, SpeachPartType speachPart, int count) {
#if !NO_REDIS

            var key = GetListKey(language, speachPart);
            int listSize = (int)(await Db.ListLengthAsync(key));
            var startIndex = listSize > count ? new Random().Next(listSize - count) : 0;
            return Db.ListRange(key, startIndex, startIndex + count).Select(v => v.ToString()).ToList<string>();
#endif
            return null;
        }

        //public static Tuple<int, int> GetBookData(int bookId) {
        //    var fields = new RedisValue[] { "size", "completed" };
        //    RedisValue[] values = Db.HashGet("book:" + bookId, fields);
        //    int bookSize;
        //    int bookCompleted;
        //    if (values[0].IsNull || values[1].IsNull ||
        //        !values[0].TryParse(out bookSize) || !values[1].TryParse(out bookCompleted)) {
        //        return null;
        //    }
        //    return new Tuple<int, int>(bookSize, bookCompleted);
        //}

        internal static List<UserBookDto> GetUserBooks(ApplicationUser user) {
            return null;
        }

        internal static void SaveUserBooks(List<UserBookDto> userBooks) {
        }

        public static MonthPlanDto GetMonthPlan(string userId, LanguageType languageType) {
            return null;
        }
    }
}