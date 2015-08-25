using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Threading.Tasks;
using MongoDB;
using MongoDB.Driver;
using MongoDB.Driver.Builders;

namespace CoolVocabulary.Models {
    public class VocabularyDbContext : DbContext {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx

        public VocabularyDbContext()
            : base("DefaultConnection") {
            this.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
        }

        public System.Data.Entity.DbSet<Word> Words { get; set; }
        public System.Data.Entity.DbSet<Vocabulary> Vocabularies { get; set; }
        public System.Data.Entity.DbSet<VocabularyWord> VocabularyWords { get; set; }

        public async Task<Vocabulary> GetDefaultVocabulary(string userId, int language) {
            const string DEFAULT_VOCABULARY = "New words";
            var vocabulary = await Vocabularies.SingleOrDefaultAsync(v=>
                v.UserID==userId &&
                v.Language==language &&
                v.Name == DEFAULT_VOCABULARY);
            if (vocabulary == null) {
                vocabulary = new Vocabulary(){
                    Name = DEFAULT_VOCABULARY,
                    UserID = userId,
                    Language = language
                };
                Vocabularies.Add(vocabulary);
                await SaveChangesAsync();
            }
            return vocabulary;
        }
    }

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

        public async Task AddWordTranslations(string sourceLanguage, string targetLanguage, WordTranslations wordTranslations) {
            var collection = GetCollection(sourceLanguage, targetLanguage);
            await collection.FindOneAndReplaceAsync(wt => wt.Word == wordTranslations.Word, wordTranslations);
        }
    }
}