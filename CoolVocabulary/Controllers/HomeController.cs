using CoolVocabulary.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CoolVocabulary.Extensions;
using System.Web.Helpers;
using System.Threading.Tasks;

namespace CoolVocabulary.Controllers {
    public class HomeController : Controller {
        private VocabularyDbContext db;
        private Repository repo;

        public HomeController() {
            db = new VocabularyDbContext();
            repo = new Repository(db);
        }

        public ActionResult CoolTranslator() {
            ViewBag.user = this.GetUser();
            return View();
        }

        [Authorize]
        public async Task<ActionResult> Vocabulary() {
            // . get user
            var user = this.GetUser();
            if (user == null) {
                return RedirectToAction("Login", "Account");
            }
            ViewBag.user = user;
            ViewBag.SupportedLanguages = SupportedLanguages.AllDto;
            return View();
        }

        public ActionResult CTOAuth() {
            return View();
        }

        public async Task<ActionResult> CTOAuthSuccess() {
            ApplicationUser user = this.GetUser();
            if (user != null) {
                ViewBag.UserData = await repo.GetUserCTDataAsync(user);
                return View();
            }
            throw new HttpException(400, "OAuth login failed");
        }
    }
}