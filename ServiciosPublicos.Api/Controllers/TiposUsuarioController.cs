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

        // Entrada: request de tipo HttpRequestMessage, string de texto de búsqueda y string de estado de tipo de Usuario
        // Salida: respuesta de tipo HttpResponseMessage y lista de tipos de Usuario.
        // Descripción: Regresa lista de todos los tipos de usuario existentes  que cumplen con 
        // los parámetros o filtros de búsqueda sin sus permisos.
        [HttpGet]
        [Route("ListaBusqueda")]
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

        // Entrada: request de tipo HttpRequestMessage, string de texto de búsqueda y string de estado de tipo de Usuario
        // Salida: respuesta de tipo HttpResponseMessage y lista de tipos de Usuario.
        // Descripción: Regresa lista de todos los tipos de usuario existentes  que cumplen con 
        // los parámetros o filtros de búsqueda sin sus permisos.
        [HttpGet]
        [Route("GetTiposUsuarioGeneral")]
        public async Task<HttpResponseMessage> GetTiposUsuarioGeneral(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var listaTipos = _tipoUsuarioService.GetTipoUsuariosGeneral();
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

        // Entrada: request de tipo HttpRequestMessage.
        // Salida: respuesta de tipo HttpResponseMessage y ID de nuevo registro de tipo INT.
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
                     int resultadoID = _tipoUsuarioService.ObtenerIDRegistro(out message);
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

        // Entrada: request de tipo HttpRequestMessage y ID de Tipo de Usuario de tipo INT
        // Salida: respuesta de tipo HttpResponseMessage y objeto de Tipo de Usuario.
        // Descripción: Obtiene el Tipo de Usuario que coincida con el ID.
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

        // Entrada: request de tipo HttpRequestMessage y descripción de Tipo de Usuario de tipo string
        // Salida: respuesta de tipo HttpResponseMessage y objeto de Tipo de Usuario.
        // Descripción: Obtiene el Tipo de Usuario que coincida con descripcion.
        [HttpGet]
        [Route("GetTipoUsuarioByDescripcion")]
        public async Task<HttpResponseMessage> GetTipoUsuarioByDescripcion(HttpRequestMessage request, string descripcion)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var tipoUsuario = _tipoUsuarioService.GetTipoUsuarioDescripcion(descripcion);
                    response = request.CreateResponse(HttpStatusCode.OK, tipoUsuario);
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

        // Entrada: request de tipo HttpRequestMessage y objeto JSON con el Tipo de Usuario y lista de tipo Permisos
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción: Insertar un nuevo tipo de usuario y sus permisos.
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

        // Entrada: request de tipo HttpRequestMessage y objeto JSON con objeto Tipo de Usuario y lista de Permisos.
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción:Este método recibe un objeto JSON que contiene los datos del tipo de usuario como "tipo"
        // y también contiene los datos de los accesos como "Procesos_Permiso", los convierte a sus
        // respectivos objetos para después guardarlos  y actualizar cada registro respectivamente.       
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

        // Entrada: request de tipo HttpRequestMessage y objeto de tipo Tipo de Usuario.
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción: Eliminación lógica de un tipo de usuario con el id del tipo de usuario
        [HttpPut]
        [Route("EliminarTipoUsuario")]
        public async Task<HttpResponseMessage> Eliminar(HttpRequestMessage request, Tipo_usuario model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _tipoUsuarioService.EliminarTipoUsuario(model, out message);
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

        // Entrada: request de tipo HttpRequestMessage y ID de Tipo de Usuario
        // Salida: respuesta de tipo HttpResponseMessage y lista de tipo Permiso.
        // Descripción: Obtener permisos de un tipo de usuario con el id del tipo de usuario.
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