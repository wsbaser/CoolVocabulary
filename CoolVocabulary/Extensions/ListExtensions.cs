using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoolVocabulary.Extensions {
    public static class ListExtensions {
        public static List<int> ToIntList(this List<string> list) {
            return list.Select(int.Parse).ToList();
        }
    }
}