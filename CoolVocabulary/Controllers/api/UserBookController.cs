using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using CoolVocabulary.Models;
using CoolVocabulary.Extensions;
using System.Web.Http.Description;
using NLog;
using Microsoft.AspNet.Identity;
using System.Data.Entity;

namespace CoolVocabulary.Controllers.api {
    public class UserBookController : ApiController {
        private Logger _logger = LogManager.GetCurrentClassLogger();
        private VocabularyDbContext db;
        private Repository repo;

        public UserBookController() {
            db = new VocabularyDbContext();
            repo = new Repository(db);
        }

        // GET api/Book
        public async Task<IHttpActionResult> GetUserBooks(string language) {
            // . get language 
            LanguageType languageType;
            if (!Enum.TryParse<LanguageType>(language, out languageType)) {
                return BadRequest("Invalid language");
            }

            // . get user
            var user = this.GetUser();
            if (user == null)
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Unauthorized));

            // . get user books
            List<UserBookDto> userBooks = Redis.GetUserBooks(user);
            if (userBooks == null) {
                userBooks = await db.GetUserBooksDtoAsync(user.Id, languageType);
                if (userBooks.Count != 0) {
                    Redis.SaveUserBooks(userBooks);
                } else {
                    UserBook firstBook = await db.GetFirstBookAsync(user.Id, languageType);
                    userBooks.Add(new UserBookDto(firstBook));
                }
            }

            // . get month statistic for the current language
            var monthStatistic = await repo.GetMonthStatisticAsync(user.Id, languageType);

            return Ok(new {
                emberDataFormat = true,
                books = userBooks.Select(ub => ub.BookDto).ToList(),
                userBooks = userBooks,
                monthStatistics = new List<MonthStatisticDto>() { monthStatistic }
            });
        }


        // DELETE api/Book/5
        [ResponseType(typeof(Book))]
        public async Task<IHttpActionResult> DeleteBook(int id) {
            try {
                string userId = User.Identity.GetUserId();
                UserBook userBook = await db.UserBooks.Include("Book").FirstOrDefaultAsync(ub => ub.Id == id);
                if (userBook == null) {
                    return NotFound();
                }
                if (userBook.UserId != userId) {
                    return BadRequest("User does not own the book.");
                }

                if (userBook.Book.CanBeUpdatedBy(userId)) {
                    db.Books.Remove(userBook.Book);
                    // . all user books will be deleted cascadely
                } else {
                    // . remove only user book
                    db.UserBooks.Remove(userBook);
                }

                await db.SaveChangesAsync();
                return Ok(userBook);
            } catch (Exception e) {
                _logger.Error("Can not delete user book", e);
                throw;
            }
        }
    }
}
