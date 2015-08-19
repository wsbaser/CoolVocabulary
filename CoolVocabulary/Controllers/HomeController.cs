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
            return View();
        }

    }
}