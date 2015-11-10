using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoolVocabulary.Models {
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
        public BookDto() { }
        public BookDto(Book book) {
            this.id = book.Id;
            this.userId = book.UserId;
            this.name = book.Name;
            this.language = ((LanguageType)book.Language).ToString();
            this.bookWords = new List<int>();
        }
        public int id { get; set; }
        public string userId { get; set; }
        [Required, MaxLength(100)]
        public string name { get; set; }
        [Required, MaxLength(2)]
        public string language { get; set; }
        public List<int> bookWords;
    }

    public class BookWordDto {
        public BookWordDto() { }
        public BookWordDto(BookWord bookWord) {
            this.id = bookWord.Id;
            this.book = bookWord.BookId;
            this.word = bookWord.WordId;
            this.speachPart = bookWord.SpeachPart;
            this.learnedAt = bookWord.LearnedAt;
            this.translations = bookWord.Translations.Select(t => t.Id).ToList();
        }
        public int id { get; set; }
        public int book { get; set; }
        public int word { get; set; }
        [Required]
        public int speachPart { get; set; }
        [Required]
        public long learnedAt { get; set; }
        public List<int> translations { get; set; }

        public BookWord ToEntity() {
            return new BookWord() {
                Id = id,
                BookId = book,
                WordId = word,
                SpeachPart = speachPart,
                LearnedAt = learnedAt
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
            this.learnLevel = translation.LearnLevel;
            this.examinedAt = translation.ExaminedAt;
        }
        public int id { get; set; }
        public int bookWord { get; set; }
        [Required]
        public string value { get; set; }
        [Required, MaxLength(2)]
        public string language { get; set; }
        [Required,Range(0, 5)]
        public int learnLevel { get; set; }
        [Required]
        public long examinedAt { get; set; }
        public Translation ToEntity() {
            LanguageType languageType;
            if (!Enum.TryParse<LanguageType>(language, out languageType)) {
                return null;
            }
            return new Translation {
                Id = id,
                BookWordId = bookWord,
                Value = value,
                Language = (int)languageType,
                LearnLevel = learnLevel,
                ExaminedAt = examinedAt
            };
        }
    }
}