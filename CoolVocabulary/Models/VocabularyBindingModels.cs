using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CoolVocabulary.Models {
    public class TranslationData {
        [Required, MaxLength(100)]
        public string word { get; set; }
        [Required]
        public string wordLanguage { get; set; }
        [MaxLength(100)]
        public string wordPronunciation { get; set; }
        public string wordSoundUrls { get; set; }
        public string wordPictureUrls { get; set; }
        [Required]
        public int bookId { get; set; }
        [Required, MaxLength(100)]
        public string translationWord { get; set; }
        [Required]
        public string translationLanguage { get; set; }
        [Required]
        public string translationWords { get; set; }
        [Required]
        public string translationCards { get; set; }
    }
}