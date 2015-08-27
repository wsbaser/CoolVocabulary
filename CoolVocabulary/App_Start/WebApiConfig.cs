using JSONAPI.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace CoolVocabulary
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config) {
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            JsonApiFormatter formatter = new JSONAPI.Json.JsonApiFormatter();
            formatter.PluralizationService = new JSONAPI.Core.PluralizationService();
            GlobalConfiguration.Configuration.Formatters.Add(formatter);
        }
    }
}
