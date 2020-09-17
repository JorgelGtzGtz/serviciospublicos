using ServiciosPublicos.Api.App_Start;
using ServiciosPublicos.Core;
using ServiciosPublicos.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace ServiciosPublicos.Api.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public class AuthenticationFilter : AuthorizationFilterAttribute
    {
        private readonly bool _isActive = true;

        public AuthenticationFilter()
        {
        }

        public AuthenticationFilter(bool isActive)
        {
            _isActive = isActive;
        }

        public override void OnAuthorization(HttpActionContext filterContext)
        {
            List<string> errors = new List<string>();
            var identity = FetchAuthHeader(filterContext, out errors);

            if (identity == null)
            {
                if (!SkipAuthorization(filterContext))
                    filterContext.Response = filterContext.Request.CreateResponse(HttpStatusCode.Unauthorized, new { errors });

                return;
            }

            var genericPrincipal = new GenericPrincipal(identity, null);
            Thread.CurrentPrincipal = genericPrincipal;

            // inside of ASP.NET this is required
            if (HttpContext.Current != null)
                HttpContext.Current.User = genericPrincipal;

            if (SkipAuthorization(filterContext))
                return;

            if (!OnAuthorizeUser(identity.Name, identity.Password, filterContext))
                return;

            base.OnAuthorization(filterContext);
        }

        protected virtual bool OnAuthorizeUser(string username, string password, HttpActionContext filterContext)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                List<string> errors = new List<string>();

                if (string.IsNullOrEmpty(username))
                    errors.Add("Usuario es requerido.");

                if (string.IsNullOrEmpty(password))
                    errors.Add("Contraseña es requerida.");

                if (errors.Count > 0)
                    filterContext.Response = filterContext.Request.CreateResponse(HttpStatusCode.Unauthorized, new { errors });

                return false;
            }

            return true;
        }

        protected virtual Authentication FetchAuthHeader(HttpActionContext filterContext, out List<string> errors)
        {
            errors = new List<string>();
            string authHeaderValue = null;
            var authRequest = filterContext.Request.Headers.Authorization;

            if (authRequest != null && !String.IsNullOrEmpty(authRequest.Scheme) && authRequest.Scheme == "Basic")
                authHeaderValue = authRequest.Parameter;

            if (string.IsNullOrEmpty(authHeaderValue))
                return null;

            authHeaderValue = Encoding.Default.GetString(Convert.FromBase64String(authHeaderValue));
            var credentials = authHeaderValue.Split(':');
            Authentication basicAuthentication = null;

            try
            {
                if (credentials.Length >= 2)
                {
                    string userName = credentials[0];
                    var _userservice = AutofacConfig.Resolve<IUsuarioService>();
                    var user = _userservice.GetUsuario(userName);

                    if (user != null)
                        basicAuthentication = new Authentication(user._Usuario, credentials[1], "Normal", user.ID, user.SuperAdmin);
                    else
                        errors.Add("Usuario " + userName + " no encontrado.");
                }
            }
            catch (Exception ex)
            {
                errors.Add(ex.Message);
            }

            return basicAuthentication;
        }

        private bool SkipAuthorization(HttpActionContext actionContext)
        {
            return actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any() || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
        }
    }
}