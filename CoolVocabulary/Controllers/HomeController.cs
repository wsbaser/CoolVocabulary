using CoolVocabulary.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CoolVocabulary.Controllers {
    public class HomeController : Controller {
        public ActionResult Index() {
            return View();
        }

        public ActionResult CoolTranslator() {
            return View();
        }

        public ActionResult Babbel() {
            return View();
        }
        public ActionResult Duolingo() {
            return View();
        }

        [Authorize]
        public ActionResult Vocabulary() {
            ViewBag.isVocabularyAction = true;
            return View();
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
                        language = b.Language
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