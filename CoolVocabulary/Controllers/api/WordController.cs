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
    public class WordController : ApiController
    {
        private VocabularyDbContext db = new VocabularyDbContext();

        // GET api/Word
        public IQueryable<Word> GetWords()
        {
            return db.Words;
        }

        // GET api/Word/5
        [ResponseType(typeof(Word))]
        public async Task<IHttpActionResult> GetWord(int id)
        {
            Word word = await db.Words.FindAsync(id);
            if (word == null)
            {
                return NotFound();
            }

            return Ok(word);
        }

        // PUT api/Word/5
        public async Task<IHttpActionResult> PutWord(int id, Word word)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != word.Id)
            {
                return BadRequest();
            }

            db.Entry(word).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WordExists(id))
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

        // POST api/Word
        [ResponseType(typeof(Word))]
        public async Task<IHttpActionResult> PostWord(Word word)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Words.Add(word);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = word.Id }, word);
        }

        // DELETE api/Word/5
        [ResponseType(typeof(Word))]
        public async Task<IHttpActionResult> DeleteWord(int id)
        {
            Word word = await db.Words.FindAsync(id);
            if (word == null)
            {
                return NotFound();
            }

            db.Words.Remove(word);
            await db.SaveChangesAsync();

            return Ok(word);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool WordExists(int id)
        {
            return db.Words.Count(e => e.Id == id) > 0;
        }
    }
}