using CoolVocabulary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using NLog;

namespace CoolVocabulary {
    public class MvcApplication : System.Web.HttpApplication {
        private Logger _logger = LogManager.GetCurrentClassLogger();

        protected void Application_Start() {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            RedisConfig.LoadExamWords();
        }
        protected void Application_Error(object sender, EventArgs e) {
            _logger.Error(Server.GetLastError());
        }
    }
}
