using dbconnection;
using Newtonsoft.Json.Linq;
using CredFecere.Core.Entities;
using CredFecere.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace CredFecere.Api.Controllers
{
    [RoutePrefix("api/TiposEntradaSalida")]
    public class TiposEntradaSalidaController : BaseApiController
    {
        private readonly ITiposEntradaSalidaService _tiposEntradaSalidaService;

        public TiposEntradaSalidaController(ITiposEntradaSalidaService tiposEntradaSalidaService)
        {
            _tiposEntradaSalidaService = tiposEntradaSalidaService;
        }

        [HttpGet]
        [Route("Lista/{descripcion?}/")]
        public async Task<HttpResponseMessage> Lista(HttpRequestMessage request, string descripcion = null)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var item = _tiposEntradaSalidaService.GetTiposEntradaSalidasFiltro(descripcion);
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

        [Route("GetTiposEntradaSalida/{id:int=0}/")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetTiposEntradaSalida(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var model = _tiposEntradaSalidaService.GetTiposEntradaSalida(id);

                    response = request.CreateResponse(HttpStatusCode.OK, model);
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

        [HttpPost]
        [Route("Guardar")]
        public async Task<HttpResponseMessage> Guardar(HttpRequestMessage request, TiposEntradaSalida data)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _tiposEntradaSalidaService.InsertUpdateTiposEntradaSalida(data, out message);
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

        [HttpDelete]
        [Route("Eliminar/{id}")]
        public async Task<HttpResponseMessage> Eliminar(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _tiposEntradaSalidaService.EliminarTiposEntradaSalida(id, out message);
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
    }
}