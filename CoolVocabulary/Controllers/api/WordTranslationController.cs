using CoolVocabulary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using System.Web.Http.Description;
using Newtonsoft.Json;
using NLog;

namespace CoolVocabulary.Controllers.api {
    [Authorize]
    public class WordTranslationController : ApiController {
        private VocabularyMongoContext mongoDb = new VocabularyMongoContext();
        private VocabularyDbContext db = new VocabularyDbContext();
        private Logger _logger = LogManager.GetCurrentClassLogger();

        // GET api/WordTranslations
        [ResponseType(typeof(WordTranslations))]
        public async Task<IHttpActionResult> GetWordTranslations([FromUri]List<string> ids, string targetLanguage) {
            if (ids.Count == 0)
                return Ok();
            try {
                LanguageType tl;
                if (!Enum.TryParse<LanguageType>(targetLanguage, out tl)) {
                    return BadRequest("Invalid targetLanguage");
                }

                var wordEntities = await db.GetWords(ids);
                if (wordEntities.Select(w => w.Language).Distinct().Count() > 1) {
                    return BadRequest("Requested words with different languages");
                }

                if (wordEntities.Count != ids.Count) {
                    return BadRequest("Invalid word ids");
                }

                string sourceLanguage = ((LanguageType)wordEntities.First().Language).ToString();

                var words = wordEntities.Select(w => w.Value);
                var wordTranslations = await mongoDb.GetWordTranslations(words, sourceLanguage, targetLanguage);
                if (wordTranslations.Count != ids.Count) {
                    return BadRequest("Word translations not found");
                }

                var SERVICES_WHITE_LIST = new List<string>{"google","abby"};
                var result = wordTranslations.Select(wt => {
                    var cards = JsonConvert.DeserializeObject<Dictionary<string, object>>(wt.TranslationCards);
                    foreach (var serviceName in cards.Keys.ToList()) {
                        if (!SERVICES_WHITE_LIST.Contains(serviceName)) {
                            cards.Remove(serviceName);
                        }
                    }
                    wt.TranslationCards = JsonConvert.SerializeObject(cards);
                    wt.TranslationWords = null;
                    return new WordTranslationsDto(wt);
                });

                return Ok(new {
                    emberDataFormat = true,
                    wordTranslations = result
                });
            } catch (Exception e) {
                _logger.Error("Unable to get Word Translations", e);
                throw;
            }
        }

        //// GET api/WordTranslations
        //[ResponseType(typeof(WordTranslations))]
        //public async Task<IHttpActionResult> GetWordTranslations(string word, string sourceLanguage, string targetLanguage) {
        //    WordTranslations entity = await mongoDb.GetWordTranslations(word, sourceLanguage, targetLanguage);
        //    if (entity == null) {
        //        return NotFound();
        //    }
        //    return Ok(entity);
        //}
    }
}
