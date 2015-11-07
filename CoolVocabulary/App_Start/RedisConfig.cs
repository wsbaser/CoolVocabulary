using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using CoolVocabulary.Models;

namespace CoolVocabulary {
    public static class RedisConfig {
        public static void LoadExamWords() {
            Redis.DelWords(LanguageType.en, SpeachPartType.noun);
            Redis.DelWords(LanguageType.en, SpeachPartType.verb);
            Redis.DelWords(LanguageType.en, SpeachPartType.adjective);
            Redis.DelWords(LanguageType.en, SpeachPartType.adverb);
            Redis.DelWords(LanguageType.ru, SpeachPartType.noun);
            Redis.DelWords(LanguageType.ru, SpeachPartType.verb);
            Redis.DelWords(LanguageType.ru, SpeachPartType.adjective);
            Redis.DelWords(LanguageType.ru, SpeachPartType.adverb);
            string dataFilePath = Path.Combine(HttpRuntime.AppDomainAppPath, "App_Start\\examwords_en.txt");
            using (StreamReader sr = new StreamReader(dataFilePath)) {
                while (!sr.EndOfStream) {
                    var line = sr.ReadLine();
                    var arr = line.Split(',');
                    var word = arr[0].Trim();
                    var translation = arr[1].Trim();
                    SpeachPartType sp;
                    if (!Enum.TryParse<SpeachPartType>(arr[2].Trim(), out sp))
                        continue;
                    Redis.PushWord(LanguageType.en, sp, word);
                    Redis.PushWord(LanguageType.ru, sp, translation);
                }
            }
        }
    }
}