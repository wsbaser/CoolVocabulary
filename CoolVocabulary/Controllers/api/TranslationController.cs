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
using AutoMapper;

namespace CoolVocabulary.Controllers.api
{
    [Authorize]
    public class TranslationController : ApiController
    {
        private VocabularyDbContext db = new VocabularyDbContext();
        private VocabularyMongoContext mongoDb = new VocabularyMongoContext();

        // GET api/Translation
        public IQueryable<Translation> GetTranslations()
        {
            return db.Translations;
        }

        // POST api/Translation
        public async Task<IHttpActionResult> PostTranslation(TranslationData data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            LanguageType wordLanguage;
            LanguageType translationLanguage;
            if (!Enum.TryParse<LanguageType>(data.wordLanguage, out wordLanguage))
            {
                return BadRequest("Invalid word language");
            }
            if (!Enum.TryParse<LanguageType>(data.translationLanguage, out translationLanguage))
            {
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
            if (data.bookId == 0)
            {
                Book book = await db.GetDefaultVocabulary(User.Identity.GetUserId(), wordLanguage);
                data.bookId = book.Id;
            }
            // . add translation
            SpeachPartType sp = GetSpeachPart(data.translationWords, data.translationWord);
            Translation translation = await db.AddTranslation(data.bookId, word.Id, data.translationWord, translationLanguage, sp);
            TranslationDto translationDto = Mapper.Map<TranslationDto>(translation);
            return CreatedAtRoute("DefaultApi", new { id = translation.Id }, translationDto);
        }

        public SpeachPartType GetSpeachPart(string translationWords, string translationWord)
        {
            return SpeachPartType.noun;
        }

        // DELETE api/Translation/5
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
            return db.Translations.Count(e => e.Id == id) > 0;
        }
    }
}