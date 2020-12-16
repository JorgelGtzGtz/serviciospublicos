using dbServiciosPublicos;
using Newtonsoft.Json.Linq;
using ServiciosPublicos.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace ServiciosPublicos.Api.Controllers
{
    [RoutePrefix("api/Reporte")]
    public class ReporteController : BaseApiController
    {
        private readonly IReporteServicio _reporteServicio;
        private readonly ITicketService _ticketService;

        public ReporteController(IReporteServicio reporteServicio, ITicketService ticketService)
        {
            _reporteServicio = reporteServicio;
            _ticketService = ticketService;
        }

        //Para obtener un listado de todos los reportes
        [HttpGet]
        [Route("GetAll")]
        public async Task<HttpResponseMessage> GetAllReportes(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var listaReportes = _reporteServicio.GetAllReportes();
                        response = request.CreateResponse(HttpStatusCode.OK, listaReportes); 
                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest,
                    new
                    {
                        error = "ERROR",
                        message = ex.Message
                    });
                }

                return await Task.FromResult(response);
            });
        }

        //Para obtener un listado de todos los reportes filtrando por cuadrilla
        [HttpGet]
        [Route("GetReportesCuadrillas/{id}")]
        public async Task<HttpResponseMessage> GetReportesCuadrilla(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var listaReportes = _reporteServicio.GetReporteCuadrilla(id);
                    response = request.CreateResponse(HttpStatusCode.OK, listaReportes);
                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest,
                    new
                    {
                        error = "ERROR",
                        message = ex.Message
                    });
                }

                return await Task.FromResult(response);
            });
        }

        //Obtener ID para registro nuevo
        [HttpGet]
        [Route("ObtenerID")]
        public async Task<HttpResponseMessage> GetIDRegistro(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    int resultadoID = _reporteServicio.ObtenerIDRegistro();
                    response = request.CreateResponse(HttpStatusCode.OK, resultadoID);
                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest,
                    new
                    {
                        error = "ERROR",
                        message = ex.Message
                    });
                }
                return await Task.FromResult(response);
            });
        }

        //Obtener imagenes del reporte
        [HttpGet]
        [Route("GetImagenesReporte")]
        public async Task<HttpResponseMessage> GetImagenesReporte(HttpRequestMessage request, string idReporte, string tipoImagen)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var imagenesReporte = _reporteServicio.GetImagenesReporte(idReporte, tipoImagen, out message);
                    response = request.CreateResponse(HttpStatusCode.OK, imagenesReporte);
                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest,
                    new
                    {
                        error = "ERROR",
                        message = ex.Message
                    });
                }

                return await Task.FromResult(response);
            });
        }

        //Insertar imagenes del reporte, tomando a consideracion, una situacion de cierre de reporte.
        //recibe un objeto JSON que contiene los datos del reporte y la lista de imagenes
        [HttpPost]
        [Route("InsertarImagenesReporte")]
        public async Task<HttpResponseMessage> InsertarImagenesReporte(HttpRequestMessage request, [FromBody] JObject data)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                var imagenes = new List<Imagen>();
                try
                {
                    var reporte = data["reporte"].ToObject<Reporte>();
                    var value = data["imagenes"].HasValues;
                    if (value)
                    {
                        imagenes = data["imagenes"].ToObject<List<Imagen>>();
                        _reporteServicio.InsertarImagenesReporte(reporte.ID_reporte, imagenes, out message);
                    }
                    response = request.CreateResponse(HttpStatusCode.OK, message);
                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest,
                    new
                    {
                        error = "ERROR",
                        message = ex.Message
                    });
                }
                return await Task.FromResult(response);
            });
        }

        /*[HttpPost]
        [Route("SubirImagenApi")]
        public string SaveFile()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                var postedFile = httpRequest.Files[0];
                string filename = postedFile.FileName;
                var physicalPath = HttpContext.Current.Server.MapPath("~/Photos/" + filename);

                postedFile.SaveAs(physicalPath);

                return physicalPath;
            }
            catch (Exception ex)
            {

                return "error" + ex.Message;
            }
        }
        */

        //Registrar un nuevo reporte,
        //recibe un objeto JSON con los datos del reporte y un listado de imagenes
        [HttpPost]
        [Route("Registrar")]
        public async Task<HttpResponseMessage> Registrar(HttpRequestMessage request, [FromBody] JObject data)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                var imagenes = new List<Imagen>();
                var datos = data;
                try
                {
                    var ticket = data["ticket"].ToObject<Ticket>();
                    var value = data["imagenes"].HasValues;
                    
                    if (value)
                    {
                        imagenes = data["imagenes"].ToObject<List<Imagen>>();
                    }
                    var idTicket = _ticketService.InsertarTicket(ticket, out message);
                    var nuevoTicket = _ticketService.GetTicket(idTicket);
                    var result = _reporteServicio.AltaReporte(nuevoTicket, imagenes, out message);

                    if (result)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, message);
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.BadRequest, message);
                    }
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

        //Actualizacion de reporte, recibe un Reporte
        [HttpPut]
        [Route("Actualizar")]
        public async Task<HttpResponseMessage> ActualizarReporte(HttpRequestMessage request, Reporte model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _reporteServicio.ActualizarReporte(model, out message);
                    if (result)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK);
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.BadRequest,
                        new
                        {
                            error = "ERROR",
                            message = message
                        });
                    }
                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest,
                    new
                    {
                        error = "ERROR",
                        message = ex.Message
                    });
                }
                return await Task.FromResult(response);
            });
        }


        //Regresa los reportes que coinciden con el parámetros que se manda
        [HttpGet]
        [Route("lista/{parametro?}/")]
        public async Task<HttpResponseMessage> GetReportesFiltro(HttpRequestMessage request, string parametro = null)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var item = _reporteServicio.GetAllReportes(parametro);
                    response = request.CreateResponse(HttpStatusCode.OK, item);
                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest,
                    new
                    {
                        error = "ERROR",
                        message = ex.Message
                    });
                }

                return await Task.FromResult(response);
            });
        }
    }
}
