using CoolVocabulary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using System.Web.Http.Description;

namespace CoolVocabulary.Controllers.api {
    [Authorize]
    public class WordTranslationController : ApiController {
        private VocabularyMongoContext mongoDb = new VocabularyMongoContext();
        private VocabularyDbContext db = new VocabularyDbContext();

        // GET api/WordTranslations
        [ResponseType(typeof(WordTranslations))]
        public async Task<IHttpActionResult> GetWordTranslations([FromUri]List<string> ids, string targetLanguage) {
            if (ids.Count == 0)
                return Ok();

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
            var result = await mongoDb.GetWordTranslations(words, sourceLanguage, targetLanguage);

            return Ok(result);
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
