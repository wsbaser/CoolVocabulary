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

namespace CoolVocabulary.Controllers
{
    public class VocabularyWordController : ApiController
    {
        private VocabularyDbContext db = new VocabularyDbContext();

        // GET api/VocabularyWord
        public IQueryable<VocabularyWord> GetVocabularyWords()
        {
            return db.VocabularyWords;
        }

        // GET api/VocabularyWord/5
        [ResponseType(typeof(VocabularyWord))]
        public async Task<IHttpActionResult> GetVocabularyWord(int id)
        {
            VocabularyWord vocabularyword = await db.VocabularyWords.FindAsync(id);
            if (vocabularyword == null)
            {
                return NotFound();
            }

            return Ok(vocabularyword);
        }

        // PUT api/VocabularyWord/5
        public async Task<IHttpActionResult> PutVocabularyWord(int id, VocabularyWord vocabularyword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vocabularyword.ID)
            {
                return BadRequest();
            }

            db.Entry(vocabularyword).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VocabularyWordExists(id))
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

        // POST api/VocabularyWord
        [ResponseType(typeof(VocabularyWord))]
        public async Task<IHttpActionResult> PostVocabularyWord(VocabularyWord vocabularyword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.VocabularyWords.Add(vocabularyword);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = vocabularyword.ID }, vocabularyword);
        }

        // DELETE api/VocabularyWord/5
        [ResponseType(typeof(VocabularyWord))]
        public async Task<IHttpActionResult> DeleteVocabularyWord(int id)
        {
            VocabularyWord vocabularyword = await db.VocabularyWords.FindAsync(id);
            if (vocabularyword == null)
            {
                return NotFound();
            }

            db.VocabularyWords.Remove(vocabularyword);
            await db.SaveChangesAsync();

            return Ok(vocabularyword);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool VocabularyWordExists(int id)
        {
            return db.VocabularyWords.Count(e => e.ID == id) > 0;
        }
    }
}