using ServiciosPublicos.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
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

        // Entrada: Ninguna
        // Salida: String con el path relativo de la imagen.
        // Descripción: Recibe en el request el file a guardar, obtiene el relative path 
        //  
        [HttpPost]
        [Route("SubirImagenApi")]
        public string SaveFile()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                var postedFile = httpRequest.Files[0];
                string filename = postedFile.FileName;
                string relativePath = "Photos/" + filename; // Tratando de guardar relative path
                var physicalPath = HttpContext.Current.Server.MapPath("~/Photos/" + filename);
                postedFile.SaveAs(physicalPath); // se guarda en carpeta Photos

                return relativePath;
            }
            catch (Exception ex)
            {

                return "error" + ex.Message;
            }
        }
    }
}
