using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using CoolVocabulary.Models;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace CoolVocabulary.Controllers {
    public class VocabularyController : Controller {
        private VocabularyDbContext db = new VocabularyDbContext();
        private VocabularyMongoContext mongoDb = new VocabularyMongoContext();

        [System.Web.Mvc.HttpGet]
        public async Task<JsonResult> GetWordTranslations(string word, string sourceLanguage, string targetLanguage) {
            var wordTranslations = await mongoDb.GetWordTranslations(word, sourceLanguage, targetLanguage);
            return Json(new { wordTranslations = wordTranslations });
        }

        [System.Web.Mvc.HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> AddWordTranslations(string sourceLanguage, string targetLanguage,
            [Bind(Include = "Word,Translations,TranslationCards")]WordTranslations wordTranslations) {
            await mongoDb.AddWordTranslations(sourceLanguage, targetLanguage, wordTranslations);
            return Json(new { error_msg = "" });
        }

        [System.Web.Mvc.HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> AddWord(
            [Bind(Include = "Value,Language,Pronunciation,SoundUrls,PictureUrls")] Word word,
            [Bind(Include = "VocabularyID,Translations,TranslationsLanguage")] VocabularyWord vocabularyWord) {
            try {
                dynamic entity = await db.Words.SingleOrDefaultAsync(w => w.Value == word.Value && w.Language == word.Language);
                if (entity == null) {
                    // . add word if necessary
                    db.Words.Add(word);
                    await db.SaveChangesAsync();
                } else
                    word = entity;
                // . add word translations to vocabulary
                entity = await db.VocabularyWords.SingleOrDefaultAsync(
                    vw => vw.VocabularyID == vocabularyWord.VocabularyID
                    && vw.WordID == word.ID);
                if (entity != null) {
                    // . update vocabulary word
                    entity.UpdateTranslations(vocabularyWord.Translations);
                } else {
                    // . add vocabulary word
                    vocabularyWord.WordID = word.ID;
                    db.VocabularyWords.Add(vocabularyWord);
                }
                await db.SaveChangesAsync();
                return Json(new { error_msg = "" });
            } catch (Exception e) {
                return Json(new { error_msg = e.Message });
            }
        }

        public async Task<JsonResult> GetVocabularies(string language) {
            var userId = GetUserId();
            int languageId;
            if (TryParseLanguage(language, out languageId))
                return Json(new { error_msg = "Invalid input data" });
            var vocabularies = await db.Vocabularies.Where(v => v.UserID == userId && v.Language == languageId).ToListAsync();
            return Json(new { vocabularies = vocabularies });
        }

        private string GetUserId() {
            var store = new UserStore<ApplicationUser>(new UserDbContext());
            var userManager = new UserManager<ApplicationUser>(store);
            ApplicationUser user = userManager.FindByNameAsync(User.Identity.Name).Result;
            return user.Id;
        }

        private bool TryParseLanguage(string language, out int value) {
            value = 0;
            LanguageType languageType;
            if (!Enum.TryParse<LanguageType>(language, out languageType))
                return false;
            value = (int)languageType;
            return true;
        }
    }

    public enum LanguageType {
        en = 0,
        ru = 1,
        es = 2
    }
}
