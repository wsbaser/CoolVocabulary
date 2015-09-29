namespace CoolVocabulary.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using CoolVocabulary.Models;
    using Microsoft.AspNet.Identity;
    using System.Data.Entity.Validation;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Collections.Generic;

    internal sealed class Configuration : DbMigrationsConfiguration<CoolVocabulary.Models.VocabularyDbContext> {
        public Configuration() {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(CoolVocabulary.Models.VocabularyDbContext context) {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            var outputLines = new System.Collections.Generic.List<string>();
            try {
                var words = new List<Word>();
                words.Add(AddWord(context, "Dog", LanguageType.en));
                words.Add(AddWord(context, "Cat", LanguageType.en));
                words.Add(AddWord(context, "Garden", LanguageType.en));
                words.Add(AddWord(context, "Run", LanguageType.en));
                words.Add(AddWord(context, "Go", LanguageType.en));
                words.Add(AddWord(context, "Have", LanguageType.en));
                words.Add(AddWord(context, "Angry", LanguageType.en));
                words.Add(AddWord(context, "Brave", LanguageType.en));
                words.Add(AddWord(context, "Healthy", LanguageType.en));
                words.Add(AddWord(context, "Badly", LanguageType.en));
                words.Add(AddWord(context, "Fully", LanguageType.en));
                words.Add(AddWord(context, "Hungry", LanguageType.en));
                context.SaveChanges();

                var userId = "6b445576-3bfc-42ae-b3a7-7920fc16837a";
                Book book = context.Books.SingleOrDefault(b =>
                    b.Name == "Martin Eden" &&
                    b.UserId == userId &&
                    b.Language == (int)LanguageType.en);
                if (book == null) {
                    book = new Book {
                        Name = "Martin Eden",
                        Language = (int)LanguageType.en,
                        UserId = userId
                    };
                    context.Books.Add(book);
                    context.SaveChanges();
                }

                var bookWords = new List<dynamic>();
                foreach (var word in words) {
                    BookWord entity = context.BookWords.SingleOrDefault(w => w.WordId == word.Id);
                    if (entity == null) {
                        entity = new BookWord { BookId = book.Id, WordId = word.Id };
                        context.BookWords.AddOrUpdate(b => b.WordId, entity);
                    }
                    bookWords.Add(entity);
                }
                context.SaveChanges();

                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "собака",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[0].Id,
                    SpeachPart = (int)SpeachPartType.noun
                });
                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "кошка",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[1].Id,
                    SpeachPart = (int)SpeachPartType.noun
                });
                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "сад",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[2].Id,
                    SpeachPart = (int)SpeachPartType.noun
                });
                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "бежать",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[3].Id,
                    SpeachPart = (int)SpeachPartType.verb
                });
                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "идти",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[4].Id,
                    SpeachPart = (int)SpeachPartType.verb
                });
                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "иметь",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[5].Id,
                    SpeachPart = (int)SpeachPartType.verb
                });
                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "сердитый",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[6].Id,
                    SpeachPart = (int)SpeachPartType.adjective
                });
                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "храбрый",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[7].Id,
                    SpeachPart = (int)SpeachPartType.adjective
                });
                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "здоровый",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[8].Id,
                    SpeachPart = (int)SpeachPartType.adjective
                });
                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "плохо",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[9].Id,
                    SpeachPart = (int)SpeachPartType.adverb
                });
                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "полностью",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[10].Id,
                    SpeachPart = (int)SpeachPartType.adverb
                });
                context.Translations.AddOrUpdate(t => t.Value, new Translation {
                    Value = "голодный",
                    Language = (int)LanguageType.ru,
                    BookWordId = bookWords[11].Id,
                    SpeachPart = (int)SpeachPartType.adjective
                });
                context.SaveChanges();
            } catch (DbEntityValidationException e) {

                foreach (var eve in e.EntityValidationErrors) {
                    outputLines.Add(string.Format(
                        "{0}: Entity of type \"{1}\" in state \"{2}\" has the following validation errors:",
                        DateTime.Now, eve.Entry.Entity.GetType().Name, eve.Entry.State));
                    foreach (var ve in eve.ValidationErrors) {
                        outputLines.Add(string.Format(
                            "- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage));
                    }
                }
            } finally {
                //Write to file
                //System.IO.File.AppendAllLines(@"c:\errors.txt", outputLines);
            }
        }

        Word AddWord(VocabularyDbContext context, string word, LanguageType language) {
            Word entity = context.Words.SingleOrDefault(w => w.Value == word && w.Language == (int)language);
            if (entity == null) {
                entity = new Word { Value = word, Language = (int)language };
                context.Words.Add(entity);
            }
            return entity;
        }
    }
}
