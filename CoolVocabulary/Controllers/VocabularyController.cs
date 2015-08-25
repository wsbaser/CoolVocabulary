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
    [System.Web.Mvc.Authorize]
    public class VocabularyController : Controller {
        private VocabularyDbContext db = new VocabularyDbContext();
        private VocabularyMongoContext mongoDb = new VocabularyMongoContext();

        [System.Web.Mvc.HttpGet]
        public async Task<JsonResult> GetWordTranslations(string word, string sourceLanguage, string targetLanguage) {
            var wordTranslations = await mongoDb.GetWordTranslations(word, sourceLanguage, targetLanguage);
            return Json(new { wordTranslations = wordTranslations });
        }

        [System.Web.Mvc.HttpPost]
        public async Task<JsonResult> AddWordTranslations(string sourceLanguage, string targetLanguage,WordTranslations wordTranslations) {
            await mongoDb.AddWordTranslations(sourceLanguage, targetLanguage, wordTranslations);
            return Json(new { error_msg = "" });
        }

        [System.Web.Mvc.HttpPost]
        public async Task<JsonResult> AddWord(Word word, VocabularyWord wordTranslation) {
            try {
                dynamic entity = await db.Words.SingleOrDefaultAsync(w => w.Value == word.Value && w.Language == word.Language);
                if (entity == null) {
                    // . add word if necessary
                    db.Words.Add(word);
                    await db.SaveChangesAsync();
                } else
                    word = entity;

                if (wordTranslation.VocabularyID == 0) {
                    var vocabulary = await db.GetDefaultVocabulary(User.Identity.GetUserId(), word.Language);
                    wordTranslation.VocabularyID = vocabulary.ID;
                }

                // . add word translations to vocabulary
                entity = await db.VocabularyWords.SingleOrDefaultAsync(
                    vw => vw.VocabularyID == wordTranslation.VocabularyID
                    && vw.WordID == word.ID);
                if (entity != null) {
                    // . update vocabulary word
                    entity.UpdateTranslations(wordTranslation.Translations);
                } else {
                    // . add vocabulary word
                    wordTranslation.WordID = word.ID;
                    db.VocabularyWords.Add(wordTranslation);
                }
                await db.SaveChangesAsync();
                return Json(new { error_msg = "" });
            } catch (Exception e) {
                return Json(new { error_msg = e.Message });
            }
        }

        [System.Web.Mvc.HttpPost]
        public async Task<JsonResult> GetBooks() {
            var userId = GetUserId();
            var vocabularies = await db.Vocabularies.Where(v => v.UserID == userId).ToListAsync();
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
}
