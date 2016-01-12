using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CoolVocabulary.Models;

namespace CoolVocabulary.Extensions {
    public static class ModelExtensions {
        public static bool CanBeUsedBy(this Book book, string userId) {
            return book.UserId == userId || book.IsPublished.Value;
        }

        public static bool CanBeUpdatedBy(this Book book, string userId) {
            return book.UserId == userId;
        }
    }
}