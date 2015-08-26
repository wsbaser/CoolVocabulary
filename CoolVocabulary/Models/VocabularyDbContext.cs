using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Threading.Tasks;

namespace CoolVocabulary.Models {
    public class VocabularyDbContext : DbContext {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx

        public VocabularyDbContext()
            : base("DefaultConnection") {
            this.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
        }

        public System.Data.Entity.DbSet<Word> Words { get; set; }
        public System.Data.Entity.DbSet<Book> Books { get; set; }
        public System.Data.Entity.DbSet<BookWord> BookWords { get; set; }
        public System.Data.Entity.DbSet<Translation> Translations { get; set; }

        public async Task<Book> GetDefaultVocabulary(string userId, LanguageType language) {
            const string DEFAULT_VOCABULARY = "New words";
            var vocabulary = await Books.SingleOrDefaultAsync(v =>
                v.UserID == userId &&
                v.Language == (int)language &&
                v.Name == DEFAULT_VOCABULARY);
            if (vocabulary == null) {
                vocabulary = new Book() {
                    Name = DEFAULT_VOCABULARY,
                    UserID = userId,
                    Language = (int)language
                };
                Books.Add(vocabulary);
                await SaveChangesAsync();
            }
            return vocabulary;
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


        public async Task<Translation> AddTranslation(int bookID, int wordID, string value, LanguageType language) {
            // . find BookWord entity
            BookWord bookWordEntity = await BookWords.SingleOrDefaultAsync(bw =>
                bw.BookID == bookID &&
                bw.WordID == wordID);
            // . create if not exists
            if (bookWordEntity == null) {
                bookWordEntity = new BookWord { WordID = wordID };
                BookWords.Add(bookWordEntity);
                await SaveChangesAsync();
            }
            // . add Translation entity
            Translation translationEntity = new Translation {
                BookWordID = bookWordEntity.ID,
                Value = value,
                Language = (int)language
            };
            Translations.Add(translationEntity);
            await SaveChangesAsync();
            return translationEntity;
        }
    }
}