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
using CoolVocabulary.Extensions;
using System.Threading;
using Newtonsoft.Json;

namespace CoolVocabulary.Controllers.api
{
    [Authorize]
    public class BookController : ApiController
    {
        private VocabularyDbContext db = new VocabularyDbContext();

        // GET api/Book
        public async Task<IHttpActionResult> GetBooks(int language, int bookId) {
            // . get books of current user
            var um = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new VocabularyDbContext()));
            var user = um.FindById(User.Identity.GetUserId());
            if (user == null)
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Unauthorized));

            var books = new Dictionary<int,BookDto>();
            List<BookWordDto> bookWords=null;
            List<WordDto> words=null;
            List<TranslationDto> translations=null;
            var noAggregatedDataBookIds = new List<int>();
            // . get books
            foreach (var book in db.Books.Where(v => v.UserId == user.Id && v.Language == language)) {
                var bookData = Redis.GetBookData(book.Id);
                if (bookData == null) {
                    books.Add(book.Id, new BookDto(book, 0, 0, true));
                    noAggregatedDataBookIds.Add(book.Id);
                } else {
                    books.Add(book.Id, new BookDto(book, bookData.Item1, bookData.Item2, false));
                }
            }
            // .get books aggregated data
            if (books.Count == 0) {
                if (bookId != 0)
                    return BadRequest("Invalid bookId");
                const string FIRST_BOOK_NAME = "Martin Eden";
                var book = await db.CreateBook(user.Id, (LanguageType)language, FIRST_BOOK_NAME);
                books.Add(book.Id, new BookDto(book, 0, 0, true));
            } else {
                int currentBookId;
                if (bookId == 0) {
                    bookId = GetCurrentBookId();
                    if (bookId != 0 && books.Values.Any(b => b.id == bookId)) {
                        currentBookId = bookId;
                    } else {
                        currentBookId = books.Keys.First();
                    }
                } else {
                    if (books.Values.Any(b => b.id == bookId)) {
                        currentBookId = bookId;
                    } else {
                        return BadRequest("Invalid bookId");
                    }
                }
                if (!noAggregatedDataBookIds.Contains(currentBookId)) {
                    noAggregatedDataBookIds.Add(currentBookId);
                }
                LoadBookData(noAggregatedDataBookIds, out bookWords, out words, out translations);
                foreach (BookWordDto bookWord in bookWords) {
                    books[bookWord.book].bookWords.Add(bookWord.id);
                }
            }
            return Ok(new {
                emberDataFormat = true,
                books = books.Values.ToList(),
                bookWords = bookWords,
                words = words,
                translations = translations
            });
        }

        private void LoadBookData(List<int> bookIds, out List<BookWordDto> bookWords, out List<WordDto> words, out List<TranslationDto> translations) {
            bookWords = new List<BookWordDto>();
            words = new List<WordDto>();
            translations = new List<TranslationDto>();
            var wordsQuery = db.BookWords.Where(v => bookIds.Contains(v.BookId)).Include("Word").Include("Translations");
            foreach (var bookWord in wordsQuery) {
                bookWords.Add(new BookWordDto(bookWord));
                words.Add(new WordDto(bookWord.Word));
                translations.AddRange(bookWord.Translations.Select(t => new TranslationDto(t)));
            }
        }

        private int GetCurrentBookId() {
            int bookId;
            if(Int32.TryParse(Request.GetCookie("CurrentBook"), out bookId))
                return bookId;
            return 0;
        }

        // GET api/Book/5
        public async Task<IHttpActionResult> GetBook(int id) {
            Book book = await db.Books.FindAsync(id);
            if (book == null) {
                return NotFound();
            }
            List<BookWordDto> bookWords = null;
            List<WordDto> words = null;
            List<TranslationDto> translations = null;
            LoadBookData(new List<int> { id }, out bookWords, out words, out translations);
            return Ok(new {
                emberDataFormat = true,
                bookWords = bookWords,
                words = words,
                translations = translations
            });
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
            if (ModelState.IsValid) {
                LanguageType bookLanguage;
                if (!Enum.TryParse<LanguageType>(bookDto.language, out bookLanguage)) {
                    return BadRequest("Invalid book language");
                }
                var userId = User.Identity.GetUserId();
                Book book = db.Books.SingleOrDefault(b => b.UserId == userId &&
                    b.Name.ToLower() == bookDto.name.ToLower() &&
                    b.Language == (int)bookLanguage);
                if (book != null) {
                    ModelState.AddModelError("name", string.Format("You already have book \"{0}\"", bookDto.name));
                } else {
                    book = new Book {
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
            }
            return new EmberDSErrorsResult(this);
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

    public class EmberDSErrorsResult : IHttpActionResult {
        private ApiController _controller;
        public EmberDSErrorsResult(ApiController controller) {
            this._controller = controller;
        }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken) {
            var response = new HttpResponseMessage(HttpStatusCode.BadRequest);
            var errors = new Dictionary<string, List<string>>();
            foreach (var kv in _controller.ModelState) {
                var list = new List<string>();
                foreach (var error in kv.Value.Errors) {
                    if (!string.IsNullOrEmpty(error.ErrorMessage)) {
                        list.Add(error.ErrorMessage);
                    }
                    if (error.Exception != null) {
                        list.Add(error.Exception.Message);
                    }
                }
                errors.Add(kv.Key, list);
            }
            var result = new {
                errors = errors
            };
            var resultJson = JsonConvert.SerializeObject(result);
            response.Content = new StringContent(resultJson);
            return Task.FromResult(response);
        }
    }
}