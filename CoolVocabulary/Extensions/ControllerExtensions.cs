using CoolVocabulary.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace CoolVocabulary.Extensions {
    public static class ControllerExtensions {
        public static dynamic EmberDSErrors(this ApiController controller) {
            var errors = new Dictionary<string, List<string>>();
            foreach (var kv in controller.ModelState) {
                var list = new List<string>();
                foreach (var error in kv.Value.Errors) {
                    if (string.IsNullOrEmpty(error.ErrorMessage)) {
                        list.Add(error.ErrorMessage);
                    }
                    if (error.Exception != null) {
                        list.Add(error.Exception.Message);
                    }
                }
                errors.Add(kv.Key, list);
            }
            return new {
                emberDataFormat = true,
                errors = errors
            };
        }

        public static ApplicationUser GetUser(this Controller controller) {
            ApplicationUser user = null;
            if (controller.Request.IsAuthenticated) {
                var um = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new VocabularyDbContext()));
                user = um.FindById(controller.User.Identity.GetUserId());
            }
            return user;
        }

        public static ApplicationUser GetUser(this ApiController controller) {
            var um = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new VocabularyDbContext()));
            return um.FindById(controller.User.Identity.GetUserId());
        }

    }
}