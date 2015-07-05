using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CoolVocabulary.Startup))]
namespace CoolVocabulary
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
