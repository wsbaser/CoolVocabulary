using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using CoolVocabulary.Extensions;
using System.Linq.Expressions;

namespace CoolVocabulary.Models {
    [BsonIgnoreExtraElements]
    public class WordTranslations {
        [BsonId]
        public ObjectId Id { get; set; }
        public string Word { get; set; }
        public string TranslationWords { get; set; }
        public string TranslationCards { get; set; }
    }

    public class MonthPlan {
        [Required]
        public Int32 Id { get; set; }
        [Required]
        [Index("UQ_UserId_Date_Language", 1, IsUnique = true)]
        public string UserId { get; set; }
        [Required]
        [Index("UQ_UserId_Date_Language", 2, IsUnique = true)]
        public int Year { get; set; }
        [Required]
        [Index("UQ_UserId_Date_Language", 3, IsUnique = true)]
        public int Month { get; set; }
        [Required]
        [Index("UQ_UserId_Date_Language", 4, IsUnique = true)]
        public int Language { get; set; }
        [Required]
        public int PlanedCount { get; set; }
        public int? LearnedCount { get; set; }
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
        public ICollection<BookWord> BookWords { get; set; }
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
        public bool? IsPublished { get; set; }
        public string Description { get; set; }
        [Required]
        [Index("UQ_UserID_Name_Language", 3, IsUnique = true)]
        public byte Language { get; set; }
        public ICollection<BookWord> BookWords { get; set; }
        public ApplicationUser User { get; set; }
    }

    public class UserBook {
        [Required]
        public int Id { get; set; }
        [Required]
        [Index("UQ_UserID_BookId", 1, IsUnique = true)]
        public int BookId { get; set; }
        [Required]
        [Index("UQ_UserID_BookId", 2, IsUnique = true)]
        public string UserId { get; set; }
        public string LearnLevels { get; set; }
        public string LearnDates { get; set; }
        public string ExamDates { get; set; }
        public string PromoteDates { get; set; }
        public Book Book { get; set; }
        public ApplicationUser User { get; set; }
    }

    public class BookWord {
        [Required]
        public int Id { get; set; }
        [Required]
        [Index("UQ_BookID_WordID_SpeachPart", 1, IsUnique = true)]
        public int BookId { get; set; }
        [Required]
        [Index("UQ_BookID_WordID_SpeachPart", 2, IsUnique = true)]
        public int WordId { get; set; }
        [Required]
        [Index("UQ_BookID_WordID_SpeachPart", 3, IsUnique = true)]
        public int SpeachPart { get; set; }
        public virtual Word Word { get; set; }
        public virtual Book Book { get; set; }
        public ICollection<Translation> Translations { get; set; }
    }

    public class Translation
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [Index("UQ_Value_Language_BookWordId", 3, IsUnique = true)]
        public int BookWordId { get; set; }
        [Required, MaxLength(100)]
        [Index("UQ_Value_Language_BookWordId", 1, IsUnique = true)]
        public string Value { get; set; }
        [Required]
        [Index("UQ_Value_Language_BookWordId", 2, IsUnique = true)]
        public byte Language { get; set; }
        public virtual BookWord BookWord { get; set; }
    }

    public enum LanguageType {
        [StringValue("English")]
        en = 0,
        [StringValue("Spanish")]
        es = 1,
        [StringValue("Portuguese")]
        pt = 2,
        [StringValue("French")]
        fr = 3,
        [StringValue("Italian")]
        it = 4,
        [StringValue("German")]
        de = 5,
        [StringValue("Russian")]
        ru = 6,
        [StringValue("Arabic")]
        ar = 7,
        [StringValue("Polish")]
        pl = 8
    }

    public static class SupportedLanguages {
        static SupportedLanguages() {
            AllDto = new List<LanguageDto>();
            All = new List<LanguageType>((IList<LanguageType>)Enum.GetValues(typeof(LanguageType)));
            for (var i = 0; i < All.Count; i++) {
                LanguageType language = (LanguageType)All[i];
                AllDto.Add(new LanguageDto {
                    id = language.ToString(),
                    name = language.GetStringValue()
                });
            }
        }
        public static List<LanguageType> All;
        public static List<LanguageDto> AllDto;

        internal static LanguageType GetDefault(LanguageType nativeLanguage) {
            return All.First(l => l != nativeLanguage);
        }
    }

    public enum SpeachPartType {
        unknown = 0,
        noun = 1,
        verb = 2,
        adjective = 3,
        adverb = 4,
        prnoun = 5,
        preposition = 6,
        conjunction = 7,
        interjection = 8
    }
}