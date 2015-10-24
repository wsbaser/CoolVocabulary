using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
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

        public const int WORDS_LIST_SIZE = 5000;

        public static void PushWord(LanguageType language, SpeachPartType speachPart, string word) {
            string key = GetListKey(language, speachPart);
            Db.ListLeftPush(key, word);
            Db.ListTrim(key, 0, WORDS_LIST_SIZE-1);
        }

        public static IEnumerable<string> GetRandomWords(LanguageType language, SpeachPartType speachPart, int count) {
            var key = GetListKey(language, speachPart);
            var startIndex = new Random().Next(WORDS_LIST_SIZE - count);
            return Db.ListRange(key, startIndex, startIndex + count).Select(v => v.ToString());
        }
    }
}