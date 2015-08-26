using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System.Threading.Tasks;

namespace CoolVocabulary.Models {
    public class VocabularyMongoContext {
        MongoClient _mongoClient;

        public VocabularyMongoContext() {
            _mongoClient = new MongoClient("mongodb://localhost");
        }

        private IMongoCollection<WordTranslations> GetCollection(string sourceLanguage, string targetLanguage) {
            // .each source language has it's own database
            var db = _mongoClient.GetDatabase("vocabulary_" + sourceLanguage);
            // .each target language has it's own collection
            string collectionName = typeof(WordTranslations).Name.ToLower() + targetLanguage;
            return db.GetCollection<WordTranslations>(collectionName);
        }

        public async Task<WordTranslations> GetWordTranslations(string word, string sourceLanguage, string targetLanguage) {
            var collection = GetCollection(sourceLanguage, targetLanguage);
            // .find record for word
            var x = await collection.FindAsync(wt => wt.Word == word);
            return x.Current.SingleOrDefault<WordTranslations>();
        }

        public async Task AddTranslations(string word, string wordLanguage, string translationsLanguage, string translationWords, string transaltionCards) {
            var collection = GetCollection(wordLanguage, translationsLanguage);
            WordTranslations entity = new WordTranslations {
                Word = word,
                TranslationWords = translationWords,
                TranslationCards = transaltionCards
            };
            await collection.FindOneAndReplaceAsync(wt => wt.Word == word, entity);
        }
    }
}