using dbServiciosPublicos;
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
    [RoutePrefix("api/reporteTicket")]
    public class ReporteTicketController : BaseApiController
    {
        private readonly IReporteTicketService _reporteTicketService;

        public ReporteTicketController(IReporteTicketService reporteTicketService)
        {
            _reporteTicketService = reporteTicketService;
        }

        // Entrada: request de tipo HttpRequestMessage y objeto de tipo Reporte_Ticket
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción: Insertar nuevo registro de tipo Reporte_Ticket en base de datos.
        [HttpPost]
        [Route("Insertar")]
        public async Task<HttpResponseMessage> InsertReporteTicket(HttpRequestMessage request, Reporte_Ticket model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _reporteTicketService.Insertar(model, out message);
                    if (result)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK);
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.BadRequest);
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

        // Entrada: request de tipo HttpRequestMessage
        // Salida: respuesta de tipo HttpResponseMessage y lista de tipo Reporte_Ticket.
        // Descripción: Para obtener todos los registros de la tabla Reporte_ticket
        [HttpGet]
        [Route("GetAll")]
        public async Task<HttpResponseMessage> GetAllReporteTicket(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var reporteTicketLista = _reporteTicketService.GetAllReporteTickets();
                    response = request.CreateResponse(HttpStatusCode.OK, reporteTicketLista);
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

        // Entrada: request de tipo HttpRequestMessage y ID de reporte de tipo INT
        // Salida: lista de tipo Reporte_Ticket 
        // Descripción: Para obtener los registros relacionados a el id de reporte que se manda
        [HttpGet]
        [Route("GetTickets/{idReporte}")]
        public async Task<HttpResponseMessage> GetTickets(HttpRequestMessage request, int idReporte)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var listaTickets = _reporteTicketService.GetReporteTickets(idReporte);
                    response = request.CreateResponse(HttpStatusCode.OK, listaTickets);
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

        // Entrada: request de tipo HttpRequestMessage y folio Reporte_ticket de tipo INT
        // Salida: respuesta de tipo HttpResponseMessage y objeto de tipo Reporte_Ticket.
        // Descripción: Para obtener un registro especifico de esta tabla
        [HttpGet]
        [Route("GetReporteTicket/{folio}")]
        public async Task<HttpResponseMessage> GetReporteTicket(HttpRequestMessage request, int folio)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var registro = _reporteTicketService.GetReporteTicket(folio);
                    response = request.CreateResponse(HttpStatusCode.OK, registro);
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
