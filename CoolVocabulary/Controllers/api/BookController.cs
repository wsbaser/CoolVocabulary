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
    public class BookController : ApiController
    {
        private VocabularyDbContext db = new VocabularyDbContext();

        // GET api/Book
        public dynamic GetBooks(int language, int bookId) {
            // . get books of current user
            var userID = User.Identity.GetUserId();
            var books = new List<dynamic>();
            var bookWords = new List<dynamic>();
            var words = new List<dynamic>();
            var translations = new List<dynamic>();
            foreach (var book in db.Books.Where(v => v.UserId == userID && v.Language==language )) {
                books.Add(new {
                    id = book.Id,
                    language = ((LanguageType)book.Language).ToString(),
                    name = book.Name,
                    userId = book.UserId,
                    bookWords = new List<int>()
                });
            }

            // . get words of current book
            dynamic currentBook = bookId == 0?
                currentBook = books.First():
                books.SingleOrDefault(b=>b.id==bookId);
            if(currentBook==null)
                return BadRequest("Invalid bookId");
            int currentBookId = currentBook.id;
            foreach (var bookWord in db.BookWords.Where(v => v.BookId == currentBookId).Include("Word").Include("Translations"))
            {
                currentBook.bookWords.Add(bookWord.Id);
                bookWords.Add(new
                {
                    id = bookWord.Id,
                    learnProgress = bookWord.LearnProgress,
                    word = bookWord.WordId,
                    book = bookWord.BookId,
                    translations = bookWord.Translations.Select(t => t.Id).ToList()
                });
                words.Add(new
                {
                    id = bookWord.Word.Id,
                    value = bookWord.Word.Value,
                    language = ((LanguageType)bookWord.Word.Language).ToString(),
                    pictureUrl = bookWord.Word.PictureUrls,
                    pronunciation = bookWord.Word.Pronunciation,
                    soundUrls = bookWord.Word.SoundUrls
                });
                foreach (Translation translation in bookWord.Translations)
                {
                    translations.Add(new
                    {
                        id = translation.Id,
                        value = translation.Value,
                        language = ((LanguageType)translation.Language).ToString(),
                        speachPart = translation.SpeachPart
                    });
                }
            }
            return new {
                emberDataFormat = true,
                books = books,
                bookWords = bookWords,
                words = words,
                translations = translations
            };
        }

        // GET api/Book/5
        [ResponseType(typeof(Book))]
        public async Task<IHttpActionResult> GetBook(int id)
        {
            Book book = await db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // PUT api/Book/5
        public async Task<IHttpActionResult> PutBook(int id, Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != book.Id)
            {
                return BadRequest();
            }

            db.Entry(book).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
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

        // POST api/Book
        public async Task<IHttpActionResult> PostBook(BookDto bookDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            LanguageType bookLanguage;
            if (!Enum.TryParse<LanguageType>(bookDto.language, out bookLanguage))
            {
                return BadRequest("Invalid book language");
            }
            var book = new Book
            {
                UserId = User.Identity.GetUserId(),
                Name = bookDto.name,
                Language = (int)bookLanguage
            };
            db.Books.Add(book);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = book.Id },
                new
                {
                    emberDataFormat = true,
                    books = new List<dynamic> { new BookDto(book) }
                });
        }

        // DELETE api/Book/5
        [ResponseType(typeof(Book))]
        public async Task<IHttpActionResult> DeleteBook(int id)
        {
            Book book = await db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            db.Books.Remove(book);
            await db.SaveChangesAsync();

            return Ok(book);
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
            return db.Books.Count(e => e.Id == id) > 0;
        }
    }
}