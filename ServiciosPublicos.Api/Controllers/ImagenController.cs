using ServiciosPublicos.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ServiciosPublicos.Api.Controllers
{
    [RoutePrefix("api/Imagen")]
    public class ImagenController : BaseApiController
    {
        private readonly IImagenService _imagenService;
        public ImagenController(IImagenService imagenService)
        {
            _imagenService = imagenService;
        }
    }
}
