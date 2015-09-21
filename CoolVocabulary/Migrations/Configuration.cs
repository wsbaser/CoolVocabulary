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

    internal sealed class Configuration : DbMigrationsConfiguration<CoolVocabulary.Models.VocabularyDbContext>
    {
        public Configuration()
        {
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
                var dogWord = AddWord(context, "Dog", LanguageType.en);
                AddWord(context, "Cat", LanguageType.en);
                AddWord(context, "Garden", LanguageType.en);
                AddWord(context, "Run", LanguageType.en);
                AddWord(context, "Go", LanguageType.en);
                AddWord(context, "Have", LanguageType.en);
                AddWord(context, "Angry", LanguageType.en);
                AddWord(context, "Brave", LanguageType.en);
                AddWord(context, "Healthy", LanguageType.en);
                AddWord(context, "Badly", LanguageType.en);
                AddWord(context, "Fully", LanguageType.en);
                AddWord(context, "Hungry", LanguageType.en);
                context.SaveChanges();

                Book book = context.Books.SingleOrDefault(b =>
                    b.Name == "Martin Eden" &&
                    b.UserId == "76084e36-84c2-48bb-b411-f6e0ad28164b" &&
                    b.Language == (int)LanguageType.en);
                if (book == null) {
                    book = new Book { Name = "Martin Eden", Language = (int)LanguageType.en, UserId = "76084e36-84c2-48bb-b411-f6e0ad28164b" };
                    context.Books.Add(book);
                    context.SaveChanges();
                }

                BookWord bookWord = new BookWord { BookId = book.Id, WordId = dogWord.Id };
                context.BookWords.AddOrUpdate(b => b.BookId, bookWord);
                context.SaveChanges();

                context.Translations.AddOrUpdate(t => t.Value,
                    new Translation { Value = "собака", Language = (int)LanguageType.ru, BookWordId = bookWord.Id, SpeachPart = (int)SpeachPartType.noun });
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
                System.IO.File.AppendAllLines(@"d:\errors.txt", outputLines);
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
