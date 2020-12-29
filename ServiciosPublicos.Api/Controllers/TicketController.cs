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

        // Entrada: request de tipo HttpRequestMessage y ID de ticket de tipo INT
        // Salida: respuesta de tipo HttpResponseMessage y objeto de tipo Ticket.
        // Descripción: Obtiene el Ticket que coincide con el ID proporcionado.
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

        // Entrada: request de tipo HttpRequestMessage
        // Salida: respuesta de tipo HttpResponseMessage y lista de tipo Ticket.
        // Descripción: Obtiene los registros de tickets de la base de datos.
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

        // Entrada: request de tipo HttpRequestMessage y objeto de tipo Ticket
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción: Actualiza la información de un registro de ticket de la base de datos.
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
