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
using Microsoft.AspNet.Identity;

namespace CoolVocabulary.Controllers.api
{
    public class TranslationController : ApiController
    {
        private VocabularyDbContext db = new VocabularyDbContext();
        private VocabularyMongoContext mongoDb = new VocabularyMongoContext();

        // GET api/BookWordTranslation
        public IQueryable<Translation> GetTranslations() {
            return db.Translations;
        }

        // POST api/BookWordTranslation
        [ResponseType(typeof(Translation))]
        public async Task<IHttpActionResult> PostTranslation(TranslationData data) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            LanguageType wordLanguage;
            LanguageType translationLanguage;
            if (!Enum.TryParse<LanguageType>(data.wordLanguage, out wordLanguage)) {
                return BadRequest("Invalid word language");
            }
            if (!Enum.TryParse<LanguageType>(data.translationLanguage, out translationLanguage)) {
                return BadRequest("Invalid translation language");
            }

            // . add word
            Word word = await db.AddWord(data.word,
                wordLanguage,
                data.wordPronunciation,
                data.wordSoundUrls,
                data.wordPictureUrls);
            // . add word translations to mongo
            await mongoDb.AddTranslations(data.word,
                data.wordLanguage,
                data.translationLanguage,
                data.translationWords,
                data.translationCards);
            // . if book id not specified - get default book
            if (data.bookId == 0) {
                Book book = await db.GetDefaultVocabulary(User.Identity.GetUserId(), wordLanguage);
                data.bookId = book.ID;
            }
            // . add translation
            Translation translation = await db.AddTranslation(data.bookId, word.ID, data.translationWord, translationLanguage);
            return CreatedAtRoute("DefaultApi", new { id = translation.ID }, translation);
        }

        // DELETE api/BookWordTranslation/5
        [ResponseType(typeof(Translation))]
        public async Task<IHttpActionResult> DeleteTranslation(int id)
        {
            Translation bookwordtranslation = await db.Translations.FindAsync(id);
            if (bookwordtranslation == null)
            {
                return NotFound();
            }

            db.Translations.Remove(bookwordtranslation);
            await db.SaveChangesAsync();

            return Ok(bookwordtranslation);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BookExists(int id)
        {
            return db.Translations.Count(e => e.ID == id) > 0;
        }
    }
}