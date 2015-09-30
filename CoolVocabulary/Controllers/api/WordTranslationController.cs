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

        // GET api/WordTranslations
        [ResponseType(typeof(WordTranslations))]
        public async Task<IHttpActionResult> GetWordTranslations(string word, string sourceLanguage, string targetLanguage) {
            WordTranslations entity = await mongoDb.GetWordTranslations(word, sourceLanguage, targetLanguage);
            if (entity == null) {
                return NotFound();
            }
            return Ok(entity);
        }
    }
}
