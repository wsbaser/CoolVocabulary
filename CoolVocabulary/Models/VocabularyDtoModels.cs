using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoolVocabulary.Models {
    //public class WordTranslations {
    //    public string Id { get; set; }
    //    public string Word { get; set; }
    //    public string TranslationWords { get; set; }
    //    public string TranslationCards { get; set; }
    //}

    public class WordDto {
        public int id { get; set; }
        public string value { get; set; }
        public int language { get; set; }
        public string pronunciation { get; set; }
        public string soundUrls { get; set; }
        public string pictureUrls { get; set; }
    }

    public class BookDto {
        public int id { get; set; }
        public string userId { get; set; }
        public string name { get; set; }
        public int language { get; set; }
    }

    public class BookWordDto {
        public int id { get; set; }
        public int bookId { get; set; }
        public int wordId { get; set; }
        public int learnProgress { get; set; }
    }

    //public class TranslationDto {
    //    public int Id { get; set; }
    //    public int BookWordId { get; set; }
    //    public string Value { get; set; }
    //    public int Language { get; set; }
    //}
}