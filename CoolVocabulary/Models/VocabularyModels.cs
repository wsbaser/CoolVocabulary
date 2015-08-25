﻿using System;
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
        [Required]
        public int ID { get; set; }
        [Required]
        [MaxLength(128)]
        public string UserID { get; set; }
        [Required, MaxLength(100)]
        public string Name { get; set; }
        [Required]
        public int Language { get; set; }
    }

    public class Word {
        [Required]
        public int ID { get; set; }
        [Required]
        public string Value { get; set; }
        [Required]
        public int Language { get; set; }
        [MaxLength(100)]
        public string Pronunciation { get; set; }
        public string SoundUrls { get; set; }
        public string PictureUrls { get; set; }
    }

    public class VocabularyWord {
        [Required]
        public int ID { get; set; }
        [Required]
        public int VocabularyID { get; set; }
        [Required]
        public int WordID { get; set; }
        [Required]
        public string Translations { get; set; }
        [Required]
        public int TranslationsLanguage { get; set; }
        public int LearnProgress { get; set; }
        public virtual Word Word { get; set; }
        public virtual Vocabulary Vocabulary { get; set; }
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