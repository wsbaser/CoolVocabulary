﻿using System;
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
using NLog;
using Microsoft.AspNet.Identity.EntityFramework;
using CoolVocabulary.Extensions;
using CoolVocabulary.Services;

namespace CoolVocabulary.Controllers.api
{
    [Authorize]
    public class TranslationController : ApiController
    {
        private static Logger _logger = LogManager.GetCurrentClassLogger();
        private VocabularyDbContext db = new VocabularyDbContext();
        private VocabularyMongoContext mongoDb = new VocabularyMongoContext();

        // GET api/Translation
        //public IQueryable<Translation> GetTranslations()
        //{
        //    return db.Translations;
        //}

        // GET api/Translation
        public async Task<IHttpActionResult> GetTranslations([FromUri]List<string> ids) {
            var data = await db.Get_TranslationsBookWordsWords_DtoAsync(ids.Select(int.Parse));
            return Ok(new {
                emberDataFormat = true,
                words = data.words,
                bookWords = data.bookWords,
                translations = data.translations
            });
        }

        // POST api/Translation
        public async Task<IHttpActionResult> PostTranslation(TranslationData data) {
            try {
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

                var user = this.GetUser();

                // . add word
                SpeachPartType sp = GetSpeachPart(data.translationWords, data.translationWord);
                LanguageFormatter languageFormatter = new LanguageFormatter(wordLanguage);
                Word word = await db.AddWord(languageFormatter.FormatWord(data.word, sp),
                    wordLanguage,
                    data.wordPronunciation,
                    data.wordSoundUrls,
                    data.wordPictureUrls);
                // . add word translations to mongo
                await mongoDb.AddTranslations(
                    data.word.ToLower(),
                    data.wordLanguage,
                    data.translationLanguage,
                    data.translationWords,
                    data.translationCards);
                // . if book id is not specified - add translation to 'Cool Translator' book
                UserBook userBook;
                if (data.bookId == 0) {
                    userBook = await db.GetCTUserBook(User.Identity.GetUserId(), wordLanguage);
                    data.bookId = userBook.BookId;
                } else {
                    userBook = await db.FindUserBookAsync(user.Id, data.bookId);
                    if (userBook == null) {
                        return BadRequest("Invalid bookId");
                    }
                    if (!userBook.Book.CanBeUpdatedBy(user.Id)) {
                        return BadRequest(string.Format("User {0} is not author of the book", user.DisplayName));
                    }
                }

                // . add translation
                Tuple<BookWord, Translation> bwt = await db.AddTranslation(data.bookId, word.Id, data.translationWord, translationLanguage, sp);

                Redis.PushWord(wordLanguage, sp, word.Value);
                Redis.PushWord(translationLanguage, sp, bwt.Item2.Value);

                var userBookDto = new UserBookDto(userBook);
                return CreatedAtRoute("DefaultApi", new { id = bwt.Item2.Id }, new {
                    userBook = userBookDto,
                    book = userBookDto.BookDto,
                    word = new WordDto(word),
                    bookWord = new BookWordDto(bwt.Item1),
                    translation = new TranslationDto(bwt.Item2)
                });
            } catch (Exception e) {
                _logger.Error(e, "Unable to add translation");
                throw;
            }
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