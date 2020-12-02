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
    [RoutePrefix("api/Permisos")]
    public class PermisosController : BaseApiController
    {
        private readonly IPermisosService _permisosService;

        public PermisosController(IPermisosService permisosService)
        {
            _permisosService = permisosService;

        }

        [HttpGet]
        [Route("GetPermisos/{idTipo}")]
        public async Task<HttpResponseMessage> getPermisos(HttpRequestMessage request,int idTipo)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var permisos = _permisosService.GetPermisos(idTipo);
                    response = request.CreateResponse(HttpStatusCode.OK, permisos);
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

        [HttpPost]
        [Route("insertPermiso/{permiso}/")]
        public async Task<HttpResponseMessage> insertPermiso(HttpRequestMessage request, Permiso model)
        {
            return await CreateHttpResponseAsync(request, async () => {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _permisosService.InsertarPermiso(model, out message);
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
                        exception = ex.Message
                    });
                }

                return await Task.FromResult(response);

            });
        }

        [HttpPut]
        [Route("actualizar")]
        public async Task<HttpResponseMessage> actualizarPermiso(HttpRequestMessage request, Permiso model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _permisosService.ActualizarPermiso(model, out message);
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
                    var result = _permisosService.EliminarPermiso(id, out message);
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
