﻿using System;
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
#if DEBUG
            _mongoClient = new MongoClient("mongodb://localhost");
#else
            _mongoClient = new MongoClient("mongodb://10.240.0.2");
#endif
        }

        private IMongoCollection<WordTranslations> GetCollection(string sourceLanguage, string targetLanguage) {
            // .each source language has it's own database
            var db = _mongoClient.GetDatabase("vocabulary_" + sourceLanguage);
            // .each target language has it's own collection
            string collectionName = typeof(WordTranslations).Name.ToLower() + "_" + targetLanguage;
            return db.GetCollection<WordTranslations>(collectionName);
        }

        public async Task<List<WordTranslations>> GetWordTranslations(IEnumerable<string> words, string sourceLanguage, string targetLanguage) {
            var collection = (IMongoCollection<WordTranslations>)GetCollection(sourceLanguage, targetLanguage);
            return await collection.Find(wt => words.Contains(wt.Word)).ToListAsync();
        }

        public async Task AddTranslations(int wordId, string word, string wordLanguage, string translationsLanguage, string translationWords, string transaltionCards) {
            IMongoCollection<WordTranslations> collection = GetCollection(wordLanguage, translationsLanguage);
            WordTranslations entity = new WordTranslations {
                Id = MongoDB.Bson.ObjectId.GenerateNewId(),
                WordId = wordId,
                Word = word,
                TranslationWords = translationWords,
                TranslationCards = transaltionCards
            };
            var filter = Builders<WordTranslations>.Filter.Eq(wt => wt.Word, word);
            WordTranslations wordTranslations = await collection.Find(filter).SingleOrDefaultAsync();
            if (wordTranslations == null) {
                await collection.InsertOneAsync(entity);
            }
        }
    }
}