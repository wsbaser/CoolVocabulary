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
                Language = (int)language
            };
            Books.Add(book);
            await SaveChangesAsync();
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


        public async Task<Tuple<BookWord, Translation>> AddTranslation(int bookID, int wordID, string value, LanguageType language, SpeachPartType speachPart)
        {
            // . search for BookWord
            BookWord bookWordEntity = await BookWords.Include("Translations").SingleOrDefaultAsync(bw =>
                bw.BookId == bookID &&
                bw.WordId == wordID &&
                bw.SpeachPart == (int)speachPart);
            Translation translationEntity = null;
            if (bookWordEntity == null)
            {
                // . create BookWord if not exists
                bookWordEntity = new BookWord
                {
                    BookId = bookID,
                    WordId = wordID,
                    SpeachPart = (int)speachPart
                };
                BookWords.Add(bookWordEntity);
                await SaveChangesAsync();
            }
            else
            {
                // . search for Translation
                translationEntity = bookWordEntity.Translations.SingleOrDefault(t => t.Value == value &&
                    t.Language == (int)language);
            }
            // . add Translation if not exists
            if (translationEntity == null)
            {
                translationEntity = new Translation
                {
                    BookWordId = bookWordEntity.Id,
                    Value = value,
                    Language = (int)language
                };
                Translations.Add(translationEntity);
                await SaveChangesAsync();
            }
            return new Tuple<BookWord, Translation>(bookWordEntity, translationEntity);
        }

        public async Task<List<Word>> GetWords(List<string> ids) {
            var range = ids.ToIntList();
            return await Words.Where(w => range.Contains(w.Id)).ToListAsync();
        }

        public async Task<List<Translation>> GetTranslations(List<string> ids) {
            var range = ids.ToIntList();
            return await Translations.Where(w => range.Contains(w.Id)).ToListAsync();
        }

        internal async Task CreateFirstBook(string userId, LanguageType language) {
            var targetBook = await CreateUserBookAsync(userId, language, "J.London, Martin Eden");
            try {
                await this.Database.ExecuteSqlCommandAsync("exec dbo.CopyBookWords @sourceBookId, @targetBookId",
                    new SqlParameter("@sourceBookId", 1),
                    new SqlParameter("@targetBookId", targetBook.Id));
            } catch (Exception e) {
                _logger.Error(e, "Error calling dbo.CopyBookWords procedure");
            }
        }

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
            return await UserBooks.Include("Book").SingleOrDefaultAsync(b => b.UserId == userId &&
                b.Book.Name.ToLower() == name.ToLower() &&
                b.Book.Language == (int)language);
        }

        internal async Task<UserBook> FindUserBookAsync(string userId, int bookId) {
            return await UserBooks.Include("Book").SingleOrDefaultAsync(b => b.UserId == userId && b.BookId == bookId);
        }

        internal async Task<List<UserBook>> GetUserBooksAsync(string userId, LanguageType languageType) {
            return await UserBooks.Include("Book")
                .Where(ub => ub.UserId == userId && ub.Book.Language == (int)languageType)
                .ToListAsync();
        }

        internal async Task<List<UserBook>> GetUserBooksAsync(string userId) {
            return await UserBooks.Include("Book")
                .Where(ub => ub.UserId == userId)
                .ToListAsync();
        }
    }
}