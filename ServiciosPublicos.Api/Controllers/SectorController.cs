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
    [RoutePrefix("api/Sector")]
    public class SectorController : BaseApiController
    {
        private readonly ISectorService _sectorService;

        public SectorController(ISectorService sectorService)
        {
            _sectorService = sectorService;
        }

        // Entrada: request de tipo HttpRequestMessage y objeto de tipo Sector
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción: Inserta el Sector en base de datos.
        [HttpPost]
        [Route("Insertar")]
        public async Task<HttpResponseMessage> InsertSector(HttpRequestMessage request, Sector model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _sectorService.InsertSector(model, out message);
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

        // Entrada: request de tipo HttpRequestMessage y objeto de tipo Sector
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción: Actualiza un registro Sector de la base de datos.
        [HttpPut]
        [Route("Actualizar")]
        public async Task<HttpResponseMessage> UpdateSector(HttpRequestMessage request, Sector model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _sectorService.UpdateSector(model, out message);
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

        // Entrada: request de tipo HttpRequestMessage y ID de sector de tipo INT
        // Salida: respuesta de tipo HttpResponseMessage y objeto de tipo Sector.
        // Descripción: Obtiene el registro de sector que coincide con el ID proporcionado.
        [HttpGet]
        [Route("GetSector/{id}/")]        
        public async Task<HttpResponseMessage> GetSector(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var sector = _sectorService.GetSector(id);

                    response = request.CreateResponse(HttpStatusCode.OK, sector);
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

        // Entrada: request de tipo HttpRequestMessage y nombre de sector de tipo string
        // Salida: respuesta de tipo HttpResponseMessage y objeto de tipo Sector.
        // Descripción: Obtiene el registro de sector que coincide con el nombre proporcionado.
        [HttpGet]
        [Route("GetSectorPorNombre")]
        public async Task<HttpResponseMessage> GetSectorPorNombre(HttpRequestMessage request, string nombre)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var sector = _sectorService.GetSectorPorNombre(nombre);

                    response = request.CreateResponse(HttpStatusCode.OK, sector);
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

        // Entrada: request de tipo HttpRequestMessage.
        // Salida: respuesta de tipo HttpResponseMessage y lista de tipo Sector
        // Descripción: Obtiene la lista de sectores existentes.
        [HttpGet]
        [Route("GetSectorList")]
        public async Task<HttpResponseMessage> GetSectorList(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = string.Empty;
                try
                {
                    var sectorLista = _sectorService.GetSectorList();
                    response = request.CreateResponse(HttpStatusCode.OK, sectorLista);

                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, new { error = "ERROR", exception = ex.Message });
                }
                return await Task.FromResult(response);
            });
        }

        // Entrada: request de tipo HttpRequestMessage, string para texto de búsqueda y string para estado.
        // Salida: lista de tipo Sector.
        // Descripción: Obtiene lista de los sectores que cumplen con los filtros de búsqueda.
        [HttpGet]
        [Route("filtrarSectores")]
        public async Task<HttpResponseMessage> GetSectoresFiltro(HttpRequestMessage request, string textoB = null, string estado = null)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = string.Empty;

                try
                {
                    var sectoresFiltrados = _sectorService.FiltroSectores(textoB, estado);
                    response = request.CreateResponse(HttpStatusCode.OK, sectoresFiltrados);
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
        // Salida: respuesta de tipo HttpResponseMessage y ID de tipo INT para nuevo registro.
        // Descripción: Obtiene el ID del nuevo registro.
        [HttpGet]
        [Route("ObtenerID")]
        public async Task<HttpResponseMessage> GetIDRegistro(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = string.Empty;

                try
                {
                    int idSectorNuevo = _sectorService.ObtenerIDRegistro();
                    response = request.CreateResponse(HttpStatusCode.OK, idSectorNuevo);
                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, 
                        new { 
                            error = "ERROR",
                            exception = ex.Message
                        });
                }
                return await Task.FromResult(response);
            });
        }

        // Entrada: request de tipo HttpRequestMessage y objeto de tipo Sector.
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción: Efectúa eliminación lógica de sector.
        [HttpPut]
        [Route("EliminarSector")]
        public async Task<HttpResponseMessage> Eliminar(HttpRequestMessage request, Sector model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _sectorService.EliminarSector(model, out message);
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
                        new { error = "ERROR", message = ex.Message});
                }
                return await Task.FromResult(response);
            });
        }
    }
}
