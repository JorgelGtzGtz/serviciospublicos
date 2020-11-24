using ServiciosPublicos.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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




    }
}
