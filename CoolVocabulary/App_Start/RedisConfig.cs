using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using CoolVocabulary.Models;
using System.Configuration;

namespace CoolVocabulary {
#if !DEBUG
    public static class RedisConfig {
        public static void LoadExamWords() {
            foreach (LanguageType languageType in Enum.GetValues(typeof(LanguageType))) {
                foreach (SpeachPartType speachPartType in Enum.GetValues(typeof(SpeachPartType))) {
                    Redis.DelWords(languageType, speachPartType);
                }
            }
            string dataFilePath = Path.Combine(ConfigurationManager.AppSettings["ExamwordsFolder"], "examwords_en.txt");
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
#endif
}