using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace CoolVocabulary.Models {
    public static class Redis {
        private static ConnectionMultiplexer _connection = ConnectionMultiplexer.Connect("localhost");
        public static IDatabase Db {
            get {
                return _connection.GetDatabase();
            }
        }

        private static string GetListKey(LanguageType language, SpeachPartType speachPart) {
            return language.ToString() + "_" + speachPart.ToString();
        }

        public const int MAX_WORDS_LIST_SIZE = 5000;

        public static void DelWords(LanguageType language, SpeachPartType speachPart) {
            string key = GetListKey(language, speachPart);
            Db.KeyDelete(key);
        }

        public static void PushWord(LanguageType language, SpeachPartType speachPart, string word) {
            string key = GetListKey(language, speachPart);
            Db.ListLeftPush(key, word);
        }

        public static async Task<List<string>> GetRandomWordsAsync(LanguageType language, SpeachPartType speachPart, int count) {
            var key = GetListKey(language, speachPart);
            int listSize = (int)(await Db.ListLengthAsync(key));
            var startIndex = listSize > count ? new Random().Next(listSize - count) : 0;
            return Db.ListRange(key, startIndex, startIndex + count).Select(v => v.ToString()).ToList<string>();
        }

        public static Tuple<int, int> GetBookData(int bookId) {
            var fields = new RedisValue[] { "size", "completed" };
            RedisValue[] values = Db.HashGet("book:" + bookId, fields);
            int bookSize;
            int bookCompleted;
            if (values[0].IsNull || values[1].IsNull ||
                !values[0].TryParse(out bookSize) || !values[1].TryParse(out bookCompleted)) {
                return null;
            }
            return new Tuple<int, int>(bookSize, bookCompleted);
        }
    }
}