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
using Newtonsoft.Json.Linq;

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
            Word word = await db.AddWord(data.word.ToLower(),
                wordLanguage,
                data.wordPronunciation,
                data.wordSoundUrls,
                data.wordPictureUrls);
            // . add word translations to mongo
            await mongoDb.AddTranslations(word.Id,
                data.word.ToLower(),
                data.wordLanguage,
                data.translationLanguage,
                data.translationWords,
                data.translationCards);
            // . if book id is not specified - add translation to 'Cool Translator' book
            Book book;
            if (data.bookId == 0) {
                book = await db.GetCTBook(User.Identity.GetUserId(), wordLanguage);
                data.bookId = book.Id;
            } else {
                book = db.Books.Find(data.bookId);
                if (book == null) {
                    return BadRequest("Invalid bookId");
                }
            }

            // . add translation
            SpeachPartType sp = GetSpeachPart(data.translationWords, data.translationWord);
            Tuple<BookWord, Translation> bwt = await db.AddTranslation(data.bookId, word.Id, data.translationWord, translationLanguage, sp);

            Redis.PushWord(wordLanguage, sp, word.Value);
            Redis.PushWord(translationLanguage, sp, bwt.Item2.Value);
            
            return CreatedAtRoute("DefaultApi", new { id = bwt.Item2.Id }, new {
                book = new BookDto(book),
                word = new WordDto(word),
                bookWord = new BookWordDto(bwt.Item1),
                translation = new TranslationDto(bwt.Item2)
            });
        }

        public SpeachPartType GetSpeachPart(string translationWords, string translationWord)
        {
            var root = JObject.Parse(translationWords);
            foreach (SpeachPartType sp in Enum.GetValues(typeof(SpeachPartType)))
            {
                if (sp == SpeachPartType.unknown)
                    continue;
                var spWords = root[((int)sp).ToString()];
                if (spWords != null && spWords.Any(w => w.ToString() == translationWord))
                    return sp;
            }
            return SpeachPartType.unknown;
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

        // PUT api/Translation/5
        public async Task<IHttpActionResult> PutTranslation(int id, TranslationDto translationDto) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var entity = translationDto.ToEntity();
            if (entity == null) {
                return BadRequest();
            }
            entity.Id = id;

            db.Entry(entity).State = EntityState.Modified;

            try {
                await db.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!TranslationExists(id)) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool TranslationExists(int id) {
            return db.Words.Count(e => e.Id == id) > 0;
        }
    }
}