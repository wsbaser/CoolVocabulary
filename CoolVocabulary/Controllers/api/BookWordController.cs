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
    public class BookWordController : ApiController
    {
        private VocabularyDbContext db = new VocabularyDbContext();

        // GET api/BookWord
        public IQueryable<BookWord> GetBookWords()
        {
            return db.BookWords;
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
        public async Task<IHttpActionResult> PutBookWord(int id, BookWord bookword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != bookword.ID)
            {
                return BadRequest();
            }

            db.Entry(bookword).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookWordExists(id))
                {
                    return NotFound();
                }
                else
                {
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

            return CreatedAtRoute("DefaultApi", new { id = bookword.ID }, bookword);
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
            return db.BookWords.Count(e => e.ID == id) > 0;
        }
    }
}