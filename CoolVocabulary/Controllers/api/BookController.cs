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
using Microsoft.AspNet.Identity.EntityFramework;

namespace CoolVocabulary.Controllers.api
{
    [Authorize]
    public class BookController : ApiController
    {
        private VocabularyDbContext db = new VocabularyDbContext();

        // GET api/Book
        public async Task<dynamic> GetBooks(int language, int bookId) {
            // . get books of current user
            var um = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new VocabularyDbContext()));
            var user = um.FindById(User.Identity.GetUserId());
            if (user == null)
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Unauthorized));

            var books = new List<BookDto>();
            var bookWords = new List<BookWordDto>();
            var words = new List<WordDto>();
            var translations = new List<TranslationDto>();
            var noAggregatedDataBookIds = new List<int>();
            // . get books
            foreach (var book in db.Books.Where(v => v.UserId == user.Id && v.Language == language)) {
                var bookData = Redis.GetBookData(book.Id);
                if (bookData == null) {
                    books.Add(new BookDto(book, 0, 0, true));
                    noAggregatedDataBookIds.Add(book.Id);
                } else {
                    books.Add(new BookDto(book, bookData.Item1, bookData.Item2, false));
                }
            }
            // .get books aggregated data
            dynamic currentBook = null;
            int currentBookId;
            if (books.Count == 0) {
                if (bookId != 0)
                    return BadRequest("Invalid bookId");
                const string FIRST_BOOK_NAME = "Martin Eden";
                var book = await db.CreateBook(user.Id, (LanguageType)language, FIRST_BOOK_NAME);
                currentBook = new BookDto(book, 0, 0, true);
                books.Add(currentBook);
            } else {
                if (bookId == 0) {
                    bookId = GetCurrentBookId();
                    if (bookId != 0) {
                        currentBook = books.SingleOrDefault(b => b.id == bookId);
                    }
                    if (currentBook == null) {
                        currentBook = books.First();
                    }
                } else {
                    currentBook = books.SingleOrDefault(b => b.id == bookId);
                    if (currentBook == null)
                        return BadRequest("Invalid bookId");
                }
            }
            currentBookId = currentBook.id;
            if (!noAggregatedDataBookIds.Contains(currentBookId)) {
                noAggregatedDataBookIds.Add(currentBookId);
            }
            var wordsQuery = db.BookWords.Where(v => noAggregatedDataBookIds.Contains(v.BookId)).Include("Word").Include("Translations");
            foreach (var bookWord in wordsQuery) {
                currentBook.bookWords.Add(bookWord.Id);
                bookWords.Add(new BookWordDto(bookWord));
                words.Add(new WordDto(bookWord.Word));
                translations.AddRange(bookWord.Translations.Select(t => new TranslationDto(t)));
            }
            return new {
                emberDataFormat = true,
                books = books,
                bookWords = bookWords,
                words = words,
                translations = translations
            };
        }

        private int GetCurrentBookId() {
            int bookId;
            if(Int32.TryParse(Request.GetCookie("CurrentBook"), out bookId))
                return bookId;
            return 0;
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
        public async Task<IHttpActionResult> PutBook(int id, BookDto bookDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var book = db.Books.Find(id);
            book.Name = bookDto.name;
            //db.Entry(book).State = EntityState.Modified;

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
        public async Task<IHttpActionResult> PostBook(BookDto bookDto) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            LanguageType bookLanguage;
            if (!Enum.TryParse<LanguageType>(bookDto.language, out bookLanguage)) {
                return BadRequest("Invalid book language");
            }
            var book = new Book {
                UserId = User.Identity.GetUserId(),
                Name = bookDto.name,
                Language = (int)bookLanguage
            };
            db.Books.Add(book);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = book.Id },
                new {
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