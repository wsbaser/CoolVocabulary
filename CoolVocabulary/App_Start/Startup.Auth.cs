using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Facebook;
using Owin;

namespace CoolVocabulary
{
    public partial class Startup
    {
        // Дополнительные сведения о настройке проверки подлинности см. по адресу: http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Включение использования файла cookie, в котором приложение может хранить информацию для пользователя, выполнившего вход,
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login")
            });
            // Use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Раскомментируйте приведенные далее строки, чтобы включить вход с помощью сторонних поставщиков входа
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //   consumerKey: "",
            //   consumerSecret: "");

            var x = new FacebookAuthenticationOptions();
            x.Scope.Add("email");
            x.AppId = "698020986995763";
            x.AppSecret = "1e506a050e170e62cb516d065305d81c";
            app.UseFacebookAuthentication(x);

            app.UseGoogleAuthentication(
                clientId: "813562463354-ir13fejg31gfmbb5utv4854m13ft7c6e.apps.googleusercontent.com",
                clientSecret: "dj26JLnwGgXKJS6xB40O0hJU");
        }
    }
}