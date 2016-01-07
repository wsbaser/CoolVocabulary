using System.Web;
using System.Web.Optimization;

namespace CoolVocabulary
{
    public class BundleConfig
    {
        // Дополнительные сведения об объединении см. по адресу: http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new ScriptBundle("~/bundles/js-basic").Include(
                        "~/Scripts/vendor/jquery-{version}.js",
                        "~/Scripts/vendor/bootstrap.js",
                        "~/Scripts/vendor/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/js-vocabulary").Include(
                "~/Scripts/vendor/ember/ember.min.js",
                "~/Scripts/vendor/ember/ember-data.min.js",
                "~/Scripts/vendor/bootstrap-modal-popover.js",
                "~/Scripts/vendor/bootstrap-dialog.min.js",
                "~/Scripts/vendor/jquery.scrollTo.min.js",
                "~/Scripts/vendor/jquery.cookie.js",
                "~/Scripts/app-vocabulary/app/vocabulary-templates.min.js",
                "~/Scripts/app-vocabulary/app/vocabulary.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/vendor/jquery.validate*"));

            // Используйте версию Modernizr для разработчиков, чтобы учиться работать. Когда вы будете готовы перейти к работе,
            // используйте средство построения на сайте http://modernizr.com, чтобы выбрать только нужные тесты.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/vendor/modernizr-*"));

            var basicStylesBundle = new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css");
            basicStylesBundle.Transforms.Add(new CssMinify());
            bundles.Add(basicStylesBundle);
        }
    }
}
