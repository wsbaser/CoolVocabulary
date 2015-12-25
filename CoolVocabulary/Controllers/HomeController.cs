using CoolVocabulary.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CoolVocabulary.Extensions;

namespace CoolVocabulary.Controllers {
    public class HomeController : Controller {
        public ActionResult CoolTranslator() {
            AddUserToViewBag();
            return View();
        }

        [Authorize]
        public ActionResult Vocabulary() {
            if (!AddUserToViewBag()) {
                return RedirectToAction("Login", "Account");
            }
            ViewBag.supportedLanguages = GetSupportedLanguages();
            return View();
        }

        private List<dynamic> GetSupportedLanguages() {
            var result = new List<dynamic>();
            var languages = Enum.GetValues(typeof(LanguageType));
            for (var i = 0; i < languages.Length; i++) {
                LanguageType language = (LanguageType)languages.GetValue(i);
                result.Add(new {
                    id = language.ToString(),
                    name = language.GetStringValue()
                });
            }
            return result;
        }

        private bool AddUserToViewBag() {
            ApplicationUser user = null;
            if (Request.IsAuthenticated) {
                var um = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new VocabularyDbContext()));
                user = um.FindById(User.Identity.GetUserId());
                ViewBag.user = user;
            }
            return user != null;
        }

        public ActionResult CTOAuth() {
            return View();
        }

        public ActionResult CTOAuthSuccess() {
            ApplicationUser user = null;
            if (Request.IsAuthenticated) {
                var um = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new VocabularyDbContext()));
                user = um.FindById(User.Identity.GetUserId());
                if (user != null) {
                    var db = new VocabularyDbContext();
                    dynamic books = db.Books.Where(b => b.UserId == user.Id).Select(b => new {
                        id = b.Id,
                        name = b.Name,
                        language = ((LanguageType)b.Language).ToString()
                    });
                    ViewBag.User = new {
                        id = user.Id,
                        name = user.DisplayName,
                        books = books
                    };
                    return View();
                }
            }
            throw new HttpException(400, "OAuth login failed");
        }
    }
}