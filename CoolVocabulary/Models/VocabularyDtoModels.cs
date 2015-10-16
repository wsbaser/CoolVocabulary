﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoolVocabulary.Models
{
    //public class WordTranslations {
    //    public string Id { get; set; }
    //    public string Word { get; set; }
    //    public string TranslationWords { get; set; }
    //    public string TranslationCards { get; set; }
    //}

    public class WordDto
    {
        public WordDto(Word word)
        {
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

    public class BookDto
    {
        public BookDto() { }
        public BookDto(Book book)
        {
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
        public BookWordDto(BookWord bookWord) {
            this.id = bookWord.Id;
            this.book = bookWord.BookId;
            this.word = bookWord.WordId;
            this.speachPart = bookWord.SpeachPart;
            this.learnedAt = bookWord.LearnedAt;
            this.checkedAt = bookWord.LearnedAt;
            this.translations = bookWord.Translations.Select(t => t.Id).ToList();
        }
        public int id { get; set; }
        public int book { get; set; }
        public int word { get; set; }
        public int speachPart { get; set; }
        public int learnedAt { get; set; }
        public int checkedAt { get; set; }
        public List<int> translations { get; set; }
    }

    public class TranslationDto
    {
        public TranslationDto(Translation translation)
        {
            this.id = translation.Id;
            this.bookWord = translation.BookWordId;
            this.value = translation.Value;
            this.language = ((LanguageType)translation.Language).ToString();
            this.learnProgress = translation.LearnProgress;
        }
        public int id { get; set; }
        public int bookWord { get; set; }
        public string value { get; set; }
        public string language { get; set; }
        public int learnProgress { get; set; }
    }
}