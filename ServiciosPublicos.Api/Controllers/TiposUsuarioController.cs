using dbServiciosPublicos;
using Newtonsoft.Json.Linq;
using ServiciosPublicos.Core.Entities;
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
    [RoutePrefix("api/TipoUsuario")]
    public class TiposUsuarioController : BaseApiController
    {
        private readonly ITipoUsuarioService _tipoUsuarioService;
        private readonly IPermisosService _permisosService;

        public TiposUsuarioController(ITipoUsuarioService tipoUsuarioService, IPermisosService permisosService)
        {
            _tipoUsuarioService = tipoUsuarioService;
            _permisosService = permisosService;
        }

        //Regresa lista de todos los tipos de usuario existentes sin sus permisos
        [HttpGet]
        [Route("ListaGeneral")]
        public async Task<HttpResponseMessage> GetTipoUsuarioFiltro(HttpRequestMessage request, string textoB = null, string estado = null)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                   var listaTipos = _tipoUsuarioService.GetTipoUsuariosFiltro(out message, textoB, estado);
                    response = request.CreateResponse(HttpStatusCode.OK, listaTipos);
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
        /* [HttpGet]
         [Route("ListaGeneral/{filtro?}/")]
         public async Task<HttpResponseMessage> GetTipoUsuarioFiltro(HttpRequestMessage request, string filtro = null)
         {
             return await CreateHttpResponseAsync(request, async () =>
             {
                 HttpResponseMessage response = null;
                 string message = String.Empty;
                 try
                 {
                     var listaTipos = _tipoUsuarioService.GetTipoUsuariosFiltro(filtro);
                     response = request.CreateResponse(HttpStatusCode.OK, listaTipos);
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
         }*/
        // Devuelve el tipo de usuario específico y sus permisos
        // como objeto JSON
        [HttpGet]
        [Route("GetTipoUsuario/{id}/")]
        public async Task<HttpResponseMessage> GetTipoUsuario(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var tipoUsuario = _tipoUsuarioService.GetTipoUsuario(id);
                    response = request.CreateResponse(HttpStatusCode.OK, tipoUsuario);
                    //var permisos = _permisosService.GetPermisos(tipoUsuario.Descripcion_tipoUsuario);
                    //response = request.CreateResponse(HttpStatusCode.OK, new { tipoUsuario, permisos });
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

        //Insertar un nuevo tipo de usuario
        [HttpPost]
        [Route("Insertar")]
        public async Task<HttpResponseMessage> Insertar(HttpRequestMessage request, [FromBody] JObject data)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var datos = data;
                    var tipo = data["tipo"].ToObject<Tipo_usuario>();
                    var permisos = data["permisos"].ToObject<List<Procesos_Permiso>>();

                    var result = _tipoUsuarioService.InsertTipoUsuario(tipo, permisos, out message);
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
                        exception = ex.Message
                    });
                }
                return await Task.FromResult(response);
            });
        }

        /*Este método recibe un objeto JSON que contiene los datos del tipo de usuario como "tipo"
         * y también contiene los datos de los accesos como "Procesos_Permiso", los convierte a sus
         * respectivos objetos para después guardarlos
         */
        [HttpPut]
        [Route("Actualizar")]
        public async Task<HttpResponseMessage> Actualizar(HttpRequestMessage request, [FromBody] JObject data)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {                    
                    var tipo = data["tipo"].ToObject<Tipo_usuario>();
                    var permisos = data["permisos"].ToObject<List<Procesos_Permiso>>();

                    var result = _tipoUsuarioService.UpdateTipoUsuario(tipo, permisos, out message);
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
                        exception = ex.Message
                    });
                }
                return await Task.FromResult(response);
            });
        }
        
        //Eliminar un tipo de usuario con el id del tipo de usuario
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
                    var result = _tipoUsuarioService.EliminarTipoUsuario(id, out message);
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

        //Obtener permisos de un tipo de usuario con el id del tipo de usuario
        [HttpGet]
        [Route("GetPermisos/{id}/")]
        public async Task<HttpResponseMessage> GetPermisosTipoUsuario(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var permisos = _tipoUsuarioService.GetPermisosTipoUsuario(id, out message);
                    response = request.CreateResponse(HttpStatusCode.OK, permisos );
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