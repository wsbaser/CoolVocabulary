﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;

namespace CoolVocabulary.Models {
    public class VocabularyDbContext : IdentityDbContext<ApplicationUser> {
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

        public async Task<Book> GetCTBook(string userId, LanguageType language) {
            const string DEFAULT_BOOK_NAME = "Cool Translator";
            var book = await Books.SingleOrDefaultAsync(v =>
                v.UserId == userId &&
                v.Language == (int)language &&
                v.Name == DEFAULT_BOOK_NAME);
            if (book == null) {
                book = new Book() {
                    Name = DEFAULT_BOOK_NAME,
                    UserId = userId,
                    Language = (int)language
                };
                Books.Add(book);
                await SaveChangesAsync();
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


        public async Task<Tuple<BookWord, Translation>> AddTranslation(int bookID, int wordID, string value, LanguageType language, SpeachPartType speachPart)
        {
            // . search for BookWord
            BookWord bookWordEntity = await BookWords.Include("Translations").SingleOrDefaultAsync(bw =>
                bw.BookId == bookID &&
                bw.WordId == wordID);
            Translation translationEntity = null;
            if (bookWordEntity == null)
            {
                // . create BookWord if not exists
                bookWordEntity = new BookWord
                {
                    BookId = bookID,
                    WordId = wordID,
                    LearnProgress = 0
                };
                BookWords.Add(bookWordEntity);
                await SaveChangesAsync();
            }
            else
            {
                // . search for Translation
                translationEntity = bookWordEntity.Translations.SingleOrDefault(t => t.Value == value &&
                    t.Language == (int)language &&
                    t.SpeachPart == (int)speachPart);
            }
            // . add Translation if not exists
            if (translationEntity == null)
            {
                translationEntity = new Translation
                {
                    BookWordId = bookWordEntity.Id,
                    Value = value,
                    Language = (int)language,
                    SpeachPart = (int)speachPart
                };
                Translations.Add(translationEntity);
                await SaveChangesAsync();
            }
            return new Tuple<BookWord, Translation>(bookWordEntity, translationEntity);
        }
    }
}