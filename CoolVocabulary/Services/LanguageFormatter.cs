using CoolVocabulary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoolVocabulary.Services {
    public class LanguageFormatter {
        LanguageType _languageType;
        public LanguageFormatter(LanguageType languageType) {
            this._languageType = languageType;
        }

        public string FormatWord(string word, SpeachPartType speachPart) {
            switch (this._languageType) {
                case LanguageType.de:
                    return word[0].ToString().ToUpper() + word.Substring(1, word.Length - 1).ToLower();
                default:
                    return word.ToLower();
            }
        }
    }
}