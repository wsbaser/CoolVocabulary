using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoolVocabulary.Models {
    public class LanguageDto {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class WordTranslationsDto {
        public WordTranslationsDto(WordTranslations wt) {
            this.id = wt.Id.ToString();
            this.word = wt.Word;
            this.translationWords = wt.TranslationWords;
            this.translationCards = wt.TranslationCards;
        }
        public string id { get; set; }
        public string word { get; set; }
        public string translationWords { get; set; }
        public string translationCards { get; set; }
    }

    public class WordDto {
        public WordDto(Word word) {
            this.id = word.Id;
            this.value = word.Value;
            this.language = ((LanguageType)word.Language).ToString();
            this.pronunciation = word.Pronunciation;
            this.soundUrls = word.SoundUrls;
            this.pictureUrls = word.PictureUrls;
        }
        public int id { get; set; }
        public string value { get; set; }
        public string language { get; set; }
        public string pronunciation { get; set; }
        public string soundUrls { get; set; }
        public string pictureUrls { get; set; }
    }

    public class BookDto {
        public int id { get; set; }
        public string user { get; set; }
        [Required, MaxLength(100)]
        public string name { get; set; }
        [Required, MaxLength(2)]
        public string language { get; set; }
        public int? userBook;
        public List<int> bookWords;

        public BookDto() { }
        public BookDto(Book book, int userBookId = 0) {
            this.id = book.Id;
            this.user = book.UserId;
            this.name = book.Name;
            this.language = ((LanguageType)book.Language).ToString();
            this.userBook = userBookId;
            this.bookWords = new List<int>();
        }
    }

    public class UserBookDto {
        public UserBookDto() { }
        public UserBookDto(UserBook userBook)
            : this(userBook, userBook.Book) {
        }
        public UserBookDto(UserBook userBook, Book book) {
            this.id = userBook.Id;
            this.user = userBook.UserId;
            this.book = userBook.Book.Id;
            this.learnLevels = userBook.LearnLevels;
            this.learnDates = userBook.LearnDates;
            this.examDates = userBook.ExamDates;
            this.promoteDates = userBook.PromoteDates;
            this.BookDto = new BookDto(book, id);
            this.translations = new Dictionary<int, List<int>>();
        }
        [NonSerialized]
        public BookDto BookDto;
        public int id { get; set; }
        public int book { get; set; }
        public string user { get; set; }
        public string learnLevels { get; set; }
        public string learnDates { get; set; }
        public string examDates { get; set; }
        public string promoteDates { get; set; }
        public Dictionary<int, List<int>> translations { get; set; }
        public void AddTranslation(int bookWordId, int translationId) {
            if (!translations.ContainsKey(bookWordId)) {
                translations.Add(bookWordId, new List<int>());
            }
            var ids = translations[bookWordId];
            ids.Add(translationId);
        }
    }

    public class BookWordDto {
        public BookWordDto() { }
        public BookWordDto(BookWord bookWord) {
            this.id = bookWord.Id;
            this.book = bookWord.BookId;
            this.word = bookWord.WordId;
            this.speachPart = bookWord.SpeachPart;
            this.translations = bookWord.Translations.Select(t => t.Id).ToList();
        }
        public int id { get; set; }
        public int book { get; set; }
        public int word { get; set; }
        [Required]
        public int speachPart { get; set; }
        public List<int> translations { get; set; }

        public BookWord ToEntity() {
            return new BookWord() {
                Id = id,
                BookId = book,
                WordId = word,
                SpeachPart = speachPart
            };
        }
    }

    public class TranslationDto {
        public TranslationDto() { }
        public TranslationDto(Translation translation) {
            this.id = translation.Id;
            this.bookWord = translation.BookWordId;
            this.value = translation.Value;
            this.language = ((LanguageType)translation.Language).ToString();
        }
        public int id { get; set; }
        public int bookWord { get; set; }
        [Required]
        public string value { get; set; }
        [Required, MaxLength(2)]
        public string language { get; set; }
        [Required, Range(0, 5)]
        public int learnLevel { get; set; }
        [Required]
        public long examinedAt { get; set; }
        [Required]
        public long fistPromotedAt { get; set; }
        [Required]
        public long lastPromotedAt { get; set; }
        public Translation ToEntity() {
            LanguageType languageType;
            if (!Enum.TryParse<LanguageType>(language, out languageType)) {
                return null;
            }
            return new Translation {
                Id = id,
                BookWordId = bookWord,
                Value = value,
                Language = (byte)languageType,
            };
        }
    }

    public class MonthPlanDto {
        public MonthPlanDto() { }
        public MonthPlanDto(MonthPlan plan) {
            id = plan.Id;
            user = plan.UserId;
            year = plan.Year;
            month = plan.Month;
            language = ((LanguageType)plan.Language).ToString();
            planedCount = plan.PlanedCount;
            learnedCount = plan.LearnedCount??0;
        }
        public Int32 id { get; set; }
        public string user { get; set; }
        public int year { get; set; }
        public int month { get; set; }
        public string language { get; set; }
        public int planedCount { get; set; }
        public int learnedCount { get; set; }
    }
}