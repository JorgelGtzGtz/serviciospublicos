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
    [RoutePrefix("api/Cuadrilla")]
    public class CuadrillaController : BaseApiController
    {
        private readonly ICuadrillaService _cuadrillServicio;

        public CuadrillaController(ICuadrillaService cuadrillaServicio)
        {
            _cuadrillServicio = cuadrillaServicio;
        }

        //Insertar nueva cuadrilla
        [HttpPost]
        [Route("Insertar")]
        public async Task<HttpResponseMessage> InsertarCuadrilla(HttpRequestMessage request, Cuadrilla model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _cuadrillServicio.InsertarCuadrilla(model, out message);
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

        //Actualizar cuadrilla existente
        [HttpPut]
        [Route("Actualizar")]
        public async Task<HttpResponseMessage> ActualizarCuadrilla(HttpRequestMessage request, Cuadrilla model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _cuadrillServicio.ActualizarCuadrilla(model, out message);
                    if (result)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK,message);
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

        //Obtener cuadrilla por id
        [HttpGet]
        [Route("GetCuadrilla/{id}/")]        
        public async Task<HttpResponseMessage> GetCuadrilla(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var cuadrilla = _cuadrillServicio.GetCuadrilla(id);

                    response = request.CreateResponse(HttpStatusCode.OK, cuadrilla);
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

        //Obtener una lista de cuadrillas existentes
        [HttpGet]
        [Route("GetCuadrillasConJefe")]        
        public async Task<HttpResponseMessage> GetCuadrillaListConJefe(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var cuadrillasLista = _cuadrillServicio.GetCuadrillasConJefe();
                    response = request.CreateResponse(HttpStatusCode.OK, cuadrillasLista);
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

        //Obtener una lista de cuadrillas existentes
        [HttpGet]
        [Route("GetCuadrillaList")]
        public async Task<HttpResponseMessage> GetCuadrillaList(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var cuadrillasLista = _cuadrillServicio.GetCuadrillaList();
                    response = request.CreateResponse(HttpStatusCode.OK, cuadrillasLista);
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
        [Route("filtrarCuadrillas")]
        public async Task<HttpResponseMessage> GetCuadrillasFiltro(HttpRequestMessage request, string textoB = null, string estado = null)
        {
            return await CreateHttpResponseAsync(request, async () => 
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var cuadrillasFiltradas = _cuadrillServicio.FiltroCuadrillas(textoB, estado);
                    response = request.CreateResponse(HttpStatusCode.OK, cuadrillasFiltradas);
                }catch(Exception ex)
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
                    int resultadoID = _cuadrillServicio.ObtenerIDRegistro();
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

        [HttpPut]
        [Route("EliminarCuadrilla")]
        public async Task<HttpResponseMessage> Eliminar(HttpRequestMessage request, Cuadrilla model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _cuadrillServicio.EliminarCuadrilla(model, out message);
                    if (result)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK,message);
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
