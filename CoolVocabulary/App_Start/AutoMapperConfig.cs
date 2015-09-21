using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using CoolVocabulary.Models;

namespace CoolVocabulary {
    public static class AutoMapperConfig {
        public static void Config() {
            Mapper.CreateMap<Book, BookDto>();
            Mapper.CreateMap<BookWord, BookWordDto>();
            Mapper.CreateMap<Word, WordDto>();
        }
    }
}