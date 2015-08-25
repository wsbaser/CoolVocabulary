using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CoolVocabulary.Custom {
    public class Authorize401Attribute : AuthorizeAttribute {
        private class Http401Result : ActionResult {
            public override void ExecuteResult(ControllerContext context) {
                // Set the response code to 401.
                context.HttpContext.Response.StatusCode = 401;
                context.HttpContext.Response.End();
            }
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext) {
            filterContext.Result = new Http401Result();
        }
    }
}