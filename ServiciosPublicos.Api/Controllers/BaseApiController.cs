using ServiciosPublicos.Api.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace ServiciosPublicos.Api.Controllers
{
    public class BaseApiController : ApiController
    {

        public Authentication UserLogged { get; set; }

        protected async Task<HttpResponseMessage> CreateHttpResponseAsync(HttpRequestMessage request, Func<Task<HttpResponseMessage>> function)
        {
            HttpResponseMessage response = null;

            try
            {
                var CurrentUser = HttpContext.Current.User;

                Thread.CurrentPrincipal = CurrentUser;

                if (Thread.CurrentPrincipal != null && Thread.CurrentPrincipal.Identity.IsAuthenticated)
                {
                    if (Thread.CurrentPrincipal.Identity is Authentication)
                    {
                        Authentication basicAuthenticationIdentity = Thread.CurrentPrincipal.Identity as Authentication;
                        UserLogged = basicAuthenticationIdentity;
                    }
                }
                response = await function.Invoke();
            }
            catch (Exception ex)
            {
                response = request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return response;
        }
    }
}