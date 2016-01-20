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

namespace CoolVocabulary.Controllers.api
{
    [Authorize]
    public class BookWordController : ApiController
    {
        private VocabularyDbContext db = new VocabularyDbContext();

        // GET api/BookWord
        public dynamic GetBookWords(int bookId) {
            var bookWords = db.BookWords.Where(v => v.BookId == bookId).Include("Word").ToList();
            dynamic bookWordsDto = bookWords.Select(bw => new BookWordDto(bw)).ToList();
            dynamic wordsDto = bookWords.Select(bw => new WordDto(bw.Word)).ToList();
            return new { emberDataFormat = true, bookWords = bookWordsDto, words = wordsDto };
        }

        // GET api/BookWord
        public async Task<IHttpActionResult> GetTranslations([FromUri]List<string> ids) {
            var data = await db.Get_BookWordsWordsTranslations_DtoAsync(ids.Select(int.Parse));
            return Ok(new {
                emberDataFormat = true,
                words = data.Words,
                bookWords = data.BookWords,
                translations = data.Translations
            });
        }

        // GET api/BookWord/5
        [ResponseType(typeof(BookWord))]
        public async Task<IHttpActionResult> GetBookWord(int id)
        {
            BookWord bookword = await db.BookWords.FindAsync(id);
            if (bookword == null)
            {
                return NotFound();
            }

            return Ok(bookword);
        }

        // PUT api/BookWord/5
        public async Task<IHttpActionResult> PutBookWord(int id, BookWordDto bookWordDto) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var entity = bookWordDto.ToEntity();
            entity.Id = id;
            db.Entry(entity).State = EntityState.Modified;

            try {
                await db.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!BookWordExists(id)) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/BookWord
        [ResponseType(typeof(BookWord))]
        public async Task<IHttpActionResult> PostBookWord(BookWord bookword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.BookWords.Add(bookword);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = bookword.Id }, bookword);
        }

        // DELETE api/BookWord/5
        [ResponseType(typeof(BookWord))]
        public async Task<IHttpActionResult> DeleteBookWord(int id)
        {
            BookWord bookword = await db.BookWords.FindAsync(id);
            if (bookword == null)
            {
                return NotFound();
            }

            db.BookWords.Remove(bookword);
            await db.SaveChangesAsync();

            return Ok(bookword);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BookWordExists(int id)
        {
            return db.BookWords.Count(e => e.Id == id) > 0;
        }
    }
}