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
using Microsoft.AspNet.Identity.EntityFramework;
using CoolVocabulary.Extensions;
using System.Threading;
using Newtonsoft.Json;
using NLog;
namespace CoolVocabulary.Controllers.api
{
    [Authorize]
    public class BookController : ApiController
    {
        private Logger _logger = LogManager.GetCurrentClassLogger();
        private VocabularyDbContext db = new VocabularyDbContext();

//        // GET api/Book
//        public async Task<IHttpActionResult> GetBooks(string language, int bookId) {
//            LanguageType languageType;
//            if (!Enum.TryParse<LanguageType>(language, out languageType)) {
//                return BadRequest("Invalid language");
//            }
//            // . get books of current user
//            var um = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new VocabularyDbContext()));
//            var user = um.FindById(User.Identity.GetUserId());
//            if (user == null)
//                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Unauthorized));

//            var userBooksDto = new Dictionary<int,UserBookDto>();
//            List<BookWordDto> bookWordsDto=null;
//            List<WordDto> wordsDto=null;
//            List<TranslationDto> translationsDto=null;
//            var noAggregatedDataBookIds = new List<int>();
//            // . get books
//            List<UserBook> userBooks = db.UserBooks.Include("Book").Where(ub => ub.UserId == user.Id && ub.Book.Language == (int)languageType).ToList();
//            foreach (UserBook userBook in userBooks) {
//                Tuple<int, int> bookData = null;
//#if !DEBUG
//                    bookData = Redis.GetBookData(book.Id);
//#endif
//                if (bookData == null) {
//                    userBooksDto.Add(userBook.Id, new UserBookDto(userBook, 0, 0, true));
//                    noAggregatedDataBookIds.Add(userBook.Id);
//                } else {
//                    userBooksDto.Add(userBook.Id, new UserBookDto(userBook, bookData.Item1, bookData.Item2, false));
//                }
//            }
//            // .get books aggregated data
//            if (userBooksDto.Count == 0) {
//                if (bookId != 0)
//                    return BadRequest("Invalid bookId");
//                UserBook userBook = await GetFirstBookAsync(user.Id, languageType);
//                userBooksDto.Add(userBook.Id, new UserBookDto(userBook, 0, 0, true));
//            } else {
//                int currentBookId;
//                if (bookId == 0) {
//                    bookId = GetCurrentBookId();
//                    if (bookId != 0 && userBooksDto.Values.Any(b => b.id == bookId)) {
//                        currentBookId = bookId;
//                    } else {
//                        currentBookId = userBooksDto.Keys.First();
//                    }
//                } else {
//                    if (userBooksDto.Values.Any(b => b.id == bookId)) {
//                        currentBookId = bookId;
//                    } else {
//                        return BadRequest("Invalid bookId");
//                    }
//                }
//                if (!noAggregatedDataBookIds.Contains(currentBookId)) {
//                    noAggregatedDataBookIds.Add(currentBookId);
//                }
//                LoadBookData(noAggregatedDataBookIds, out bookWordsDto, out wordsDto, out translationsDto);
//                SetUserData(userBooks, bookWordsDto, translationsDto);
//                foreach (BookWordDto bookWord in bookWordsDto) {
//                    userBooksDto[bookWord.book].bookWords.Add(bookWord.id);
//                }
//            }
//            return Ok(new {
//                emberDataFormat = true,
//                books = userBooksDto.Values.ToList(),
//                bookWords = bookWordsDto,
//                words = wordsDto,
//                translations = translationsDto
//            });
//        }

        ///// <summary>
        ///// User data for book words and translations is stored in JSON fieds of UsedBook object
        ///// We need to parse that data and inject to BookWord and Translation objects
        ///// </summary>
        //private void SetUserData(List<UserBook> userBooks, List<BookWordDto> bookWordsList, List<TranslationDto> translationsList) {
        //    var bookWords = bookWordsList.ToDictionary(bw => bw.id, bw => bw);
        //    var translations = translationsList.ToDictionary(t => t.id, t => t);
        //    var bookUserDataList = userBooks.Select(ub => new {
        //        bookId = ub.Id,
        //        LearnLevels = JsonConvert.DeserializeObject<Dictionary<int, int>>(ub.LearnLevels),
        //        LearnDates = JsonConvert.DeserializeObject<Dictionary<int, DateTime>>(ub.LearnDates),
        //        ExamDates = JsonConvert.DeserializeObject<Dictionary<int, DateTime>>(ub.ExamDates),
        //        FirstPromoteDates = JsonConvert.DeserializeObject<Dictionary<int, DateTime>>(ub.FirstPromoteDates),
        //        LastPromoteDates = JsonConvert.DeserializeObject<Dictionary<int, DateTime>>(ub.LastPromoteDates)
        //    });
        //    foreach (var bookUserData in bookUserDataList) {
        //        BookWordDto bookWordDto = bookWords[bookUserData.bookId];
        //        bookWordDto.learnedAt = bookUserData.LearnDates[bookUserData.bookId].Ticks;
        //        foreach (int translationId in bookWordDto.translations) {
        //            TranslationDto translationDto = translations[translationId];
        //            translationDto.learnLevel = bookUserData.LearnLevels[translationId];
        //            translationDto.examinedAt = bookUserData.ExamDates[translationId].Ticks;
        //            translationDto.fistPromotedAt = bookUserData.FirstPromoteDates[translationId].Ticks;
        //            translationDto.lastPromotedAt = bookUserData.LastPromoteDates[translationId].Ticks;
        //        }
        //    }
        //}


        //private void LoadBookData(List<int> bookIds, out List<BookWordDto> bookWords, out List<WordDto> words, out List<TranslationDto> translations) {
        //    bookWords = new List<BookWordDto>();
        //    words = new List<WordDto>();
        //    translations = new List<TranslationDto>();
        //    var wordsQuery = db.BookWords.Where(v => bookIds.Contains(v.BookId)).Include("Word").Include("Translations");
        //    foreach (var bookWord in wordsQuery) {
        //        bookWords.Add(new BookWordDto(bookWord));
        //        words.Add(new WordDto(bookWord.Word));
        //        translations.AddRange(bookWord.Translations.Select(t => new TranslationDto(t)));
        //    }
        //}

        //private int GetCurrentBookId() {
        //    int bookId;
        //    if(Int32.TryParse(Request.GetCookie("CurrentBook"), out bookId))
        //        return bookId;
        //    return 0;
        //}

        // GET api/Book/5
        public async Task<IHttpActionResult> GetBook(int id) {
            Book book = await db.Books.FindAsync(id);
            if (book == null) {
                return NotFound();
            }
            List<BookWordDto> bookWords = new List<BookWordDto>();
            List<WordDto> words = new List<WordDto>();
            List<TranslationDto> translations = new List<TranslationDto>();
            var wordsQuery = db.BookWords.Where(v => v.BookId == id).Include("Word").Include("Translations");
            foreach (var bookWord in wordsQuery) {
                bookWords.Add(new BookWordDto(bookWord));
                words.Add(new WordDto(bookWord.Word));
                translations.AddRange(bookWord.Translations.Select(t => new TranslationDto(t)));
            }
            return Ok(new {
                emberDataFormat = true,
                words = words,
                bookWords = bookWords,
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
                UserBook userBook = await db.FindUserBookAsync(userId, bookDto.name, bookLanguage);
                if (userBook != null) {
                    ModelState.AddModelError("name", string.Format("You already have book \"{0}\"", bookDto.name));
                } else {
                    userBook = await db.CreateUserBookAsync(User.Identity.GetUserId(), bookLanguage, bookDto.name);
                    var userBookDto = new UserBookDto(userBook);
                    return CreatedAtRoute("DefaultApi", new { id = userBook.Id },
                        new {
                            emberDataFormat = true,
                            books = new List<dynamic> { userBookDto.BookDto },
                            userBooks = new List<dynamic> { userBookDto }
                        });
                }
            }
            return new EmberDSErrorsResult(this);
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