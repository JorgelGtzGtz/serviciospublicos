﻿using dbServiciosPublicos;
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

        // Entrada: Http request y ID tipo de Cuadrilla de tipo Int
        // Salida: Lista de tipo dynamic con los registros de reportes.
        // Descripción: Para obtener un listado de todos los reportes filtrando por cuadrilla
        [HttpGet]
        [Route("GetReportesCuadrillasFiltro")]
        public async Task<HttpResponseMessage> GetReportesCuadrilla(HttpRequestMessage request, string idCuadrilla=null)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var listaReportes = _reporteServicio.GetReporteFiltroCuadrilla(idCuadrilla);
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

        // Entrada: Http request
        // Salida: valor tipo Int con el nuevo ID
        // Descripción: Obtener ID para registro nuevo
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

        // Entrada: Http request, string con ID de reporte y string con indicador del tipo de imagen.
        // Salida: Lista de Imagenes.
        // Descripción: Obtener imagenes del reporte
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

        // Entrada: Http request y objeto JSON con los datos del reporte y el listado de imágenes.
        // Salida: Lista de Imagenes.
        // Descripción: Insertar imagenes del reporte, tomando a consideracion, una situacion de cierre de reporte.
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


        // Entrada: Http request y objeto JSON con los datos del reporte y el listado de imágenes.
        // Salida: respuesta de tipo HttpResponseMessage
        // Descripción: Registrar un nuevo reporte,
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

        // Entrada: request de tipo HttpRequestMessage y objeto de tipo reporte
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción: Actualizacion de reporte.
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
                    var result = _reporteServicio.ActualizarReporte(model, HttpContext.Current.Server.MapPath("~") , out message);
                    if (result)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, message);
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

        // Entrada: request tipo HttpRequestMessage y valores string para tipo reporte, estado, sector, origen, fecha inicial y fecha final
        // Salida: respuesta de tipo HttpResponseMessage con la lista de tipo dynamic, con los registros que coincidieron.
        // Descripción: Regresa los reportes que coinciden con el parámetros que se manda
        [HttpGet]
        [Route("ListaBusqueda")]
        public async Task<HttpResponseMessage> GetReportesFiltro(HttpRequestMessage request, string tipoR=null, string cuadrilla=null, 
            string estado=null, string sector=null, string origen=null, string fechaIni=null, string fechaF=null, string tipoFecha=null)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var item = _reporteServicio.GetReportesFiltro(tipoR, cuadrilla, estado, sector, origen, fechaIni, fechaF, tipoFecha);
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

        //G: PARA VISUALIZAR TODOS LOS REPORTES ASIGNADOS A JEFE DE CUADRILLA EN LA APP
        [HttpGet]
        [Route("GetReporteByJefeAsignado/{id_jefe}/{id_tipo}/{id_estatus}/{page}/{results}")]
        public async Task<HttpResponseMessage> GetReporteByJefe(HttpRequestMessage request, int id_jefe, int id_tipo, int id_estatus, int page, int results)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var listaReportes = _reporteServicio.GetReporteJefeAsignado(id_jefe, id_tipo, id_estatus, page, results);
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
        //G:METODO PARA ENVIAR SMS DE AVISO
        [HttpPost]
        [Route("SendSMS")]
        public async Task<HttpResponseMessage> SendMail(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _reporteServicio.SendSMS(out message);
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
    }
}
