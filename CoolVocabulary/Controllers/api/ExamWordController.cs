//using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using CoolVocabulary.Models;
using System.Data.Entity;
using StackExchange.Redis;
using System;
using MongoDB.Bson;

namespace CoolVocabulary.Controllers.api {
    public class ExamWordController : ApiController {
        private VocabularyDbContext db = new VocabularyDbContext();

        private async Task AddRandomWordsAsync(List<dynamic> words, LanguageType language, SpeachPartType speachPart, int count) {
#if !NO_REDIS
            List<string> list = await Redis.GetRandomWordsAsync(language, speachPart, count);
            foreach (string word in list) {
                words.Add(new {
                    id = ObjectId.GenerateNewId().ToString(),
                    language = language.ToString(),
                    speachPart = (int)speachPart,
                    word = word
                });
            }
#endif
        }

        // GET api/ExamCard
        public async Task<dynamic> Get(string sourceLanguage, string targetLanguage,
            int nounsCount, int verbsCount, int adjectivesCount, int adverbsCount) {
            LanguageType sourceLanguageType;
            LanguageType targetLanguageType;
            if (!Enum.TryParse<LanguageType>(sourceLanguage, out sourceLanguageType)) {
                return BadRequest("Invalid source language");
            }
            if (!Enum.TryParse<LanguageType>(targetLanguage, out targetLanguageType)) {
                return BadRequest("Invalid target language");
            }
            var words = new List<dynamic>();
            await AddRandomWordsAsync(words, sourceLanguageType, SpeachPartType.noun, nounsCount);
            await AddRandomWordsAsync(words, sourceLanguageType, SpeachPartType.verb, verbsCount);
            await AddRandomWordsAsync(words, sourceLanguageType, SpeachPartType.adjective, adjectivesCount);
            await AddRandomWordsAsync(words, sourceLanguageType, SpeachPartType.adverb, adverbsCount);
            await AddRandomWordsAsync(words, targetLanguageType, SpeachPartType.noun, nounsCount);
            await AddRandomWordsAsync(words, targetLanguageType, SpeachPartType.verb, verbsCount);
            await AddRandomWordsAsync(words, targetLanguageType, SpeachPartType.adjective, adjectivesCount);
            await AddRandomWordsAsync(words, targetLanguageType, SpeachPartType.adverb, adverbsCount);
            return words;
        }
    }
}