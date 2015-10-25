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

        public static void PushWord(LanguageType language, SpeachPartType speachPart, string word) {
            string key = GetListKey(language, speachPart);
            Db.ListLeftPush(key, word);
            Db.ListTrim(key, 0, MAX_WORDS_LIST_SIZE - 1);
        }

        public static async Task<List<string>> GetRandomWordsAsync(LanguageType language, SpeachPartType speachPart, int count) {
            var key = GetListKey(language, speachPart);
            int listSize = (int)(await Db.ListLengthAsync(key));
            var startIndex = listSize > count ? new Random().Next(listSize - count) : 0;
            return Db.ListRange(key, startIndex, startIndex + count).Select(v => v.ToString()).ToList<string>();
        }
    }
}