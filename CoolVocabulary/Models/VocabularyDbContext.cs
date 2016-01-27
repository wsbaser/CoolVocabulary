using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using CoolVocabulary.Extensions;
using System.Data.SqlClient;
using NLog;
using CoolVocabulary.Extensions;

namespace CoolVocabulary.Models {
    public class VocabularyDbContext : IdentityDbContext<ApplicationUser> {
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx

        public VocabularyDbContext()
            : base("CoolVocabulary_PGSQL") {
            this.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
        }

        public System.Data.Entity.DbSet<Word> Words { get; set; }
        public System.Data.Entity.DbSet<Book> Books { get; set; }
        public System.Data.Entity.DbSet<UserBook> UserBooks { get; set; }
        public System.Data.Entity.DbSet<BookWord> BookWords { get; set; }
        public System.Data.Entity.DbSet<Translation> Translations { get; set; }
        public System.Data.Entity.DbSet<MonthPlan> MonthPlans { get; set; }

        public async Task<UserBook> GetCTUserBook(string userId, LanguageType language) {
            const string CT_BOOK_NAME = "Cool Translator";
            var userBook = await FindUserBookAsync(userId, CT_BOOK_NAME, language);
            if (userBook == null) {
                userBook = await CreateUserBookAsync(userId, language, CT_BOOK_NAME);
            }
            return userBook;
        }

        public async Task<UserBook> CreateUserBookAsync(string userId, LanguageType language, string name) {
            Book book = await CreateBookAsync(userId, language, name);
            return await CreateUserBookForBookAsync(book.Id, userId);
        }

        private async Task<Book> CreateBookAsync(string userId, LanguageType language, string name) {
            var book = new Book() {
                Name = name,
                UserId = userId,
                Language = (byte)language
            };
            try {
                Books.Add(book);
                await SaveChangesAsync();
            }catch(Exception e){
                _logger.Error(e);
            }
            return book;
        }

        public async Task<Word> AddWord(string word, LanguageType language, string pronunciation, string soundUrls, string pictureUrls) {
            Word entity = await Words.SingleOrDefaultAsync(w => w.Value == word && w.Language == (int)language);
            if (entity == null) {
                entity = new Word {
                    Value = word,
                    Language = (int)language,
                    Pronunciation = pronunciation,
                    SoundUrls = soundUrls,
                    PictureUrls = pictureUrls
                };
                Words.Add(entity);
                await SaveChangesAsync();
            }
            return entity;
        }


        public async Task<Tuple<BookWord, Translation>> AddTranslation(int bookID, int wordID, string value, LanguageType language, SpeachPartType speachPart) {
            // . search for BookWord
            BookWord bookWordEntity = await BookWords.Include("Translations").SingleOrDefaultAsync(bw =>
                bw.BookId == bookID &&
                bw.WordId == wordID &&
                bw.SpeachPart == (int)speachPart);
            Translation translationEntity = null;
            if (bookWordEntity == null) {
                // . create BookWord if not exists
                bookWordEntity = new BookWord {
                    BookId = bookID,
                    WordId = wordID,
                    SpeachPart = (int)speachPart
                };
                BookWords.Add(bookWordEntity);
                await SaveChangesAsync();
            } else {
                // . search for Translation
                translationEntity = bookWordEntity.Translations.SingleOrDefault(t => t.Value == value &&
                    t.Language == (int)language);
            }
            // . add Translation if not exists
            if (translationEntity == null) {
                translationEntity = new Translation {
                    BookWordId = bookWordEntity.Id,
                    Value = value,
                    Language = (byte)language
                };
                Translations.Add(translationEntity);
                await SaveChangesAsync();
            }
            return new Tuple<BookWord, Translation>(bookWordEntity, translationEntity);
        }

        public async Task<List<Word>> GetWords(List<string> ids) {
            var range = ids.ToIntList();
            return await Words.Where(w => range.Contains(w.Id)).AsNoTracking().ToListAsync();
        }

        public async Task<List<Translation>> GetTranslations(List<string> ids) {
            var range = ids.ToIntList();
            return await Translations.Where(w => range.Contains(w.Id)).AsNoTracking().ToListAsync();
        }

        public async Task<UserBook> CreateFirstBookAsync(string userId, LanguageType languageType) {
            const string FIRST_BOOK_NAME = "My First Book";
            return await CreateUserBookAsync(userId, languageType, FIRST_BOOK_NAME);
        }

        //internal async Task CreateFirstBook(string userId, LanguageType language) {
        //    var targetBook = await CreateUserBookAsync(userId, language, "J.London, Martin Eden");
        //    try {
        //        await this.Database.ExecuteSqlCommandAsync("exec dbo.CopyBookWords @sourceBookId, @targetBookId",
        //            new SqlParameter("@sourceBookId", 1),
        //            new SqlParameter("@targetBookId", targetBook.Id));
        //    } catch (Exception e) {
        //        _logger.Error(e, "Error calling dbo.CopyBookWords procedure");
        //    }
        //}

        internal async Task<UserBook> CreateUserBookForBookAsync(int bookId, string userId) {
            var userBook = new UserBook() {
                UserId = userId,
                BookId = bookId
            };
            UserBooks.Add(userBook);
            await SaveChangesAsync();
            return userBook;
        }

        public async Task<UserBook> GetUserBookForBookAsync(int bookId, string userId) {
            Book book = await Books.FindAsync(bookId);
            if (book != null && book.CanBeUsedBy(userId)) {
                return await CreateUserBookForBookAsync(bookId, userId);
            }
            return null;
        }

        internal async Task<UserBook> FindUserBookAsync(string userId, string name, LanguageType language) {
            return await UserBooks.Include("Book").AsNoTracking().SingleOrDefaultAsync(b => b.UserId == userId &&
                b.Book.Name.ToLower() == name.ToLower() &&
                b.Book.Language == (int)language);
        }

        internal async Task<UserBook> FindUserBookAsync(string userId, int bookId) {
            return await UserBooks.Include("Book").SingleOrDefaultAsync(b => b.UserId == userId && b.BookId == bookId);
        }

        internal async Task<List<UserBook>> GetUserBooksAsync(string userId, LanguageType languageType) {
            return await UserBooks.Include("Book")
                .Where(ub => ub.UserId == userId && ub.Book.Language == (int)languageType)
                .AsNoTracking().ToListAsync();
        }

        internal async Task<List<UserBookDto>> GetUserBooksDtoAsync(string userId, LanguageType? languageType) {
            // . Select user books(BookDto included) with bookWord
            var languageId = languageType == null ? -1 : (int)languageType;
            var data = await UserBooks.Where(ub => ub.UserId == userId && (languageId == -1 || ub.Book.Language == languageId))
                .Join(Books, ub => ub.BookId, b => b.Id, (ub, b) => new {
                    userBook = ub,
                    book = b
                }).AsNoTracking().ToListAsync();
            var userBooksDtoDict = data.DistinctBy(d => d.userBook.Id)
                .Select(d => new UserBookDto(d.userBook, d.book))
                .ToDictionary(ub => ub.id, ub => ub);

            List<int> userBookIds = userBooksDtoDict.Keys.ToList(); 
            var translationsData = await UserBooks.Where(ub=>userBookIds.Contains(ub.Id))
                .Join(BookWords, ub => ub.BookId, bw => bw.BookId, (ub, bw) => new {
                    userBook = ub,
                    bookWord = bw
                }).Join(Translations, ubbbw => ubbbw.bookWord.Id, t => t.BookWordId, (ubbwb, t) => new {
                    userBook = ubbwb.userBook,
                    bookWord = ubbwb.bookWord,
                    translation = t
                }).AsNoTracking().ToListAsync();

            foreach (var d in translationsData) {
                var userBookDto = userBooksDtoDict[d.userBook.Id];
                userBookDto.AddTranslation(d.bookWord.Id, d.translation.Id);
            }

            return userBooksDtoDict.Values.ToList<UserBookDto>();
        }

        internal async Task<List<UserBook>> GetUserBooksAsync(string userId) {
            return await UserBooks.Include("Book")
                .Where(ub => ub.UserId == userId)
                .AsNoTracking().ToListAsync();
        }

        internal async Task<dynamic> Get_TranslationsBookWordsWords_DtoAsync(IEnumerable<int> translationIds) {
            var data = await Translations.Where(t => translationIds.Contains(t.Id))
                .Join(BookWords, t => t.BookWordId, bw => bw.Id, (t, bw) => new { translation = t, bookWord = bw })
                .Join(Words, tbw => tbw.bookWord.WordId, w => w.Id, (tbw, w) => new {
                    translation = tbw.translation,
                    bookWord = tbw.bookWord,
                    word = w
                })
                .AsNoTracking().ToListAsync();
            return new {
                words = data.Select(d => d.word).Distinct().Select(w => new WordDto(w)),
                bookWords = data.Select(d => d.bookWord).Distinct().Select(bw => new BookWordDto(bw)),
                translations = data.Select(d => d.translation).Distinct().Select(t => new TranslationDto(t))
            };
        }

        internal async Task<MonthPlan> GetThisMonthPlanAsync(string userId, LanguageType languageType) {
            var year = DateTime.Today.Year;
            var month = DateTime.Today.Month;
            MonthPlan monthStatistic = null; ;
            try {
                monthStatistic = await MonthPlans.SingleOrDefaultAsync(ms => ms.UserId == userId &&
                    ms.Year == year &&
                    ms.Month == month &&
                    ms.Language == (int)languageType);
            }catch(Exception e){
                _logger.Error(e);
            }
            return monthStatistic;
        }

        internal async Task<MonthPlan> CreateMonthPlanAsync(string userId, LanguageType languageType, int planedCount) {
            var plan = new MonthPlan() {
                UserId = userId,
                Year = DateTime.Today.Year,
                Month = DateTime.Today.Month,
                Language = (int)languageType,
                PlanedCount = planedCount
            };
            MonthPlans.Add(plan);
            await SaveChangesAsync();
            return plan;
        }

        internal async Task<dynamic> Get_BookWordsWordsTranslations_DtoAsync(IEnumerable<int> bookWordIds) {
            var data = await BookWords.Where(t => bookWordIds.Contains(t.Id))
                .Join(Words, bw => bw.WordId, w => w.Id, (bw, w) => new { bookWord = bw, word = w })
                .Join(Translations, bww => bww.bookWord.Id, t => t.BookWordId, (bww, t) => new {
                    translation = t,
                    bookWord = bww.bookWord,
                    word = bww.word
                })
                .AsNoTracking().ToListAsync();
            return new {
                words = data.Select(d => d.word).Distinct().Select(w => new WordDto(w)),
                bookWords = data.Select(d => d.bookWord).Distinct().Select(bw => new BookWordDto(bw)),
                translations = data.Select(d => d.translation).Distinct().Select(t => new TranslationDto(t))
            };
        }
    }
}