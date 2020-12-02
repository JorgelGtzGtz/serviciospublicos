using ServiciosPublicos.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ServiciosPublicos.Api.Controllers
{
    [RoutePrefix("api/ProcesosPermisos")]
    public class ProcesosPermisosController : BaseApiController
    {
        private readonly IProcesosPermisosService _procesosPermisosService;

        public ProcesosPermisosController(IProcesosPermisosService procesosPermisosService)
        {
            _procesosPermisosService = procesosPermisosService;

        }

        [HttpGet]
        [Route("GetProcesosPermisos")]
        public async Task<HttpResponseMessage> GetPermisos(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var permisos = _procesosPermisosService.GetProcesos();
                    response = request.CreateResponse(HttpStatusCode.OK, permisos);
                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest,
                    new
                    {
                        error = "ERROR",
                        exception = ex.Message
                    });
                }
                return await Task.FromResult(response);
            });
        }









    }
}
