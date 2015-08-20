using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace CoolVocabulary.Models {
    public class WordTranslations {
        public string ID { get; set; }
        public string Word { get; set; }
        public string Translations { get; set; }
        public string TranslationCards { get; set; }
    }

    public class Vocabulary {
        public int ID { get; set; }
        [MaxLength(128)]
        public string UserID { get; set; }
        public int Name { get; set; }
        public int Language { get; set; }
    }

    public class Word {
        public int ID { get; set; }
        public string Value { get; set; }
        public int Language { get; set; }
        public string Pronunciation { get; set; }
        public string SoundUrls { get; set; }
        public string PictureUrls { get; set; }
    }

    public class VocabularyWord {
        public int ID { get; set; }
        public int VocabularyID { get; set; }
        public int WordID { get; set; }
        public string Translations { get; set; }
        public int TranslationsLanguage { get; set; }
        public int LearnProgress { get; set; }
        public void UpdateTranslations(string translations) {
            if (string.IsNullOrWhiteSpace(translations))
                return;
            var list1 = this.Translations.Split(',').ToList<string>();
            var list2 = translations.Split(',').ToList<string>();
            this.Translations = list1.Union(list2).Aggregate(string.Empty, (current, s) => s + (current + ","));
            this.Translations = this.Translations.Remove(this.Translations.Length - 1);
        }
    }

    public enum LanguageType {
        en = 0,
        ru = 1,
        es = 2
    }

}