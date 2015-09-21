using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoolVocabulary.Models {
    public class WordTranslations {
        public string Id { get; set; }
        public string Word { get; set; }
        public string TranslationWords { get; set; }
        public string TranslationCards { get; set; }
    }

    public class Word {
        [Required]
        public int Id { get; set; }
        [Required, MaxLength(100)]
        [Index("UQ_Value_Language", 1, IsUnique = true)]
        public string Value { get; set; }
        [Required]
        [Index("UQ_Value_Language", 2, IsUnique = true)]
        public int Language { get; set; }
        [MaxLength(100)]
        public string Pronunciation { get; set; }
        public string SoundUrls { get; set; }
        public string PictureUrls { get; set; }
    }

    public class Book {
        [Required]
        public int Id { get; set; }
        [Required]
        [MaxLength(128)]
        [Index("UQ_UserID_Name_Language", 1, IsUnique = true)]
        public string UserId { get; set; }
        [Required, MaxLength(100)]
        [Index("UQ_UserID_Name_Language", 2, IsUnique = true)]
        public string Name { get; set; }
        [Required]
        [Index("UQ_UserID_Name_Language", 3, IsUnique = true)]
        public int Language { get; set; }
        public ICollection<BookWord> BookWords { get; set; }
        public ApplicationUser User { get; set; }
    }

    public class BookWord {
        [Required]
        public int Id { get; set; }
        [Required]
        public int BookId { get; set; }
        [Required]
        public int WordId { get; set; }
        [Range(0, 4)]
        public int LearnProgress { get; set; }
        public virtual Word Word { get; set; }
        public virtual Book Book { get; set; }
        public ICollection<Translation> Translations { get; set; }
    }

    public class Translation {
        [Required]
        public int Id { get; set; }
        [Required]
        public int BookWordId { get; set; }
        [Required, MaxLength(100)]
        public string Value { get; set; }
        [Required]
        public int Language { get; set; }
        [Required]
        public int SpeachPart { get; set; }
        public virtual BookWord BookWord { get; set; }
    }

    public enum LanguageType {
        en = 0,
        ru = 1,
        es = 2
    }

    public enum SpeachPartType {
        noun = 1,
        verb = 2,
        adjective = 3,
        adverb = 4
    }
}