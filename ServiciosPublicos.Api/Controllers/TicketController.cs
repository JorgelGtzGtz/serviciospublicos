using dbServiciosPublicos;
using Newtonsoft.Json.Linq;
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
    [RoutePrefix("api/Ticket")]
    public class TicketController : BaseApiController
    {
        private readonly ITicketService _ticketService;
        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }
   /*     
        [HttpPost]
        [Route("Registrar")]
        public async Task<HttpResponseMessage> InsertTicket(HttpRequestMessage request, [FromBody] JObject data)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                var imagenes = new List<Imagen>();
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
                    var result = _ticketService.VerificarExistenciaReporte(nuevoTicket, imagenes, out message); 

                    if (result)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, message);
                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.BadRequest,message);
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
   */

        [HttpGet]
        [Route("GetTicket/{id}/")]
        public async Task<HttpResponseMessage> GetTicket(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var ticket = _ticketService.GetTicket(id);
                    response = request.CreateResponse(HttpStatusCode.OK, ticket);
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

        [HttpGet]
        [Route("GetTicketsLista")]
        public async Task<HttpResponseMessage> GetTicketsLista(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var listaTickets = _ticketService.GetTickets();
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

        [HttpGet]
        [Route("GetTicketsByUser/{id}/{id_tipo}/{id_estatus}")]
        public async Task<HttpResponseMessage> GetTicketsByUser(HttpRequestMessage request, int id, int id_tipo, int id_estatus)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var listaTickets = _ticketService.GetTicketsByUserID(id, id_tipo, id_estatus);
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

        [HttpPut]
        [Route("ActualizarTicket")]
        public async Task<HttpResponseMessage> ActualizarTicket(HttpRequestMessage request, Ticket model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var ticket = _ticketService.ActualizarTicket(model, out message);

                    response = request.CreateResponse(HttpStatusCode.OK, message);
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
