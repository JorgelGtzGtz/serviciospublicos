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
    [RoutePrefix("api/TipoReporte")]
    public class TipoReporteController : BaseApiController
    {
        private readonly ITipoReporteService _tipoReporteService;

        public TipoReporteController(ITipoReporteService tipoReporteService)
        {
            _tipoReporteService = tipoReporteService;

        }

        [HttpGet]
        [Route("GetTipoReporte")]
        public async Task<HttpResponseMessage> GetTipoReporte(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var tipos = _tipoReporteService.GetTipos();

                    response = request.CreateResponse(HttpStatusCode.OK, tipos);
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
