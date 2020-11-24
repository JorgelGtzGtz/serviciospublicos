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
          
        //Para obtener los registros relacionados a el id de reporte que se manda
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
                    response = request.CreateResponse(HttpStatusCode.OK, result);
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


        //Para obtener todos los registros de la tabla
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

        //Para obtener los registros relacionados a el id de reporte que se manda
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


        //Para obtener un registro especifico de esta tabla
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
