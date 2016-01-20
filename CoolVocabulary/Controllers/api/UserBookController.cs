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
            List<UserBookDto> userBooksDto = Redis.GetUserBooks(user);
            if (userBooksDto == null) {
                userBooksDto = await db.GetUserBooksDtoAsync(user.Id, languageType);
                if (userBooksDto.Count != 0) {
                    Redis.SaveUserBooks(userBooksDto);
                } else {
                    UserBook firstBook = await db.GetFirstBookAsync(user.Id, languageType);
                    userBooksDto.Add(new UserBookDto(firstBook));
                }
            }

            // . get month statistic for the current language
            var monthPlanDto = await repo.GetMonthPlanDtoAsync(user.Id, languageType);

            return Ok(new {
                emberDataFormat = true,
                books = userBooksDto.Select(ub => ub.BookDto).ToList(),
                userBooks = userBooksDto,
                monthPlans = new List<MonthPlanDto>() { monthPlanDto }
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
