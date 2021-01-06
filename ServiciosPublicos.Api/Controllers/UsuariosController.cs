using dbServiciosPublicos;
using ServiciosPublicos.Core.Entities;
using ServiciosPublicos.Core.Entities.Dto;
using ServiciosPublicos.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace ServiciosPublicos.Api.Controllers
{
    [RoutePrefix("api/Usuario")]
    public class UsuariosController : BaseApiController
    {
        private readonly IUsuarioService _usuarioservice;
        public UsuariosController(IUsuarioService usuarioservice)
        {
            _usuarioservice = usuarioservice;
        }

        // Entrada: request de tipo HttpRequestMessage
        // Salida: respuesta de tipo HttpResponseMessage y objeto de tipo Usuario.
        // Descripción: Revisa la autenticidad de los datos del usuario y busca el objeto Usuario
        // que coincide con el usuario y contraseña proporcionados.
        [HttpPost]
        [Route("Login")]
        public async Task<HttpResponseMessage> Authenticate(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    if (UserLogged != null)
                    {
                        var op = _usuarioservice.GetUsuario(UserLogged.UserName, UserLogged.Password);
                        User = Thread.CurrentPrincipal;
                        response = request.CreateResponse(HttpStatusCode.OK, op);
                    }
                    else
                    {
                        message = "Usuario o contraseña invalidas, Intente de nuevo.";
                        response = request.CreateResponse(HttpStatusCode.NotFound, 
                            new { Status = "ERROR", message = message, Sucess = false });
                    }

                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest,
                    new
                    {
                        Status = "ERROR",
                        Message = ex.Message
                    });
                }
                return await Task.FromResult(response);
            });
        }

        // Entrada: request de tipo HttpRequestMessage, string de texto de búsqueda, string de estado de usuario, string de tipo de usuario
        //          string de tipo de usuario y string para reportes activos.
        // Salida: respuesta de tipo HttpResponseMessage y lista de tipo dynamic con los registros de usuario.
        // Descripción: Busca los registros de usuario que cumplan con los filtros de búsqueda.
        [HttpGet]
        [Route("ListaBusqueda")]
        public async Task<HttpResponseMessage> GetUsuariosFiltro(HttpRequestMessage request, string textoB = null, string estado = null, string tipoU = null, string repActivos = null)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var listaUsuarios = _usuarioservice.GetUsuariosFiltro(textoB, estado, tipoU, repActivos);
                    response = request.CreateResponse(HttpStatusCode.OK, listaUsuarios);
                }
                catch (Exception ex)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest,
                    new
                    {
                        error = "Error al hacer búsqueda de usuarios",
                        message = ex.Message
                    });
                }

                return await Task.FromResult(response);
            });
        }

        // Entrada: request de tipo HttpRequestMessage y ID de Usuario de tipo INT
        // Salida: respuesta de tipo HttpResponseMessage y objeto de tipo Usuario.
        // Descripción: Obtiene el objeto Usuario que coioncida con el ID proporcionado.
        [Route("GetUsuario/{id:int}/")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetUsuario(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var usuario = _usuarioservice.GetUsuario(id);

                    response = request.CreateResponse(HttpStatusCode.OK, usuario);
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
        // Salida: respuesta de tipo HttpResponseMessage y lista de tipo Usuario.
        // Descripción: Busca los usuarios cuyo tipo de usuario sea de jefes de cuadrilla.
        [Route("GetJefesCuadrilla")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetUsuariosJefes(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var jefesCuadrillas = _usuarioservice.GetUsuariosJefeCuadrilla();

                    response = request.CreateResponse(HttpStatusCode.OK, jefesCuadrillas);
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

        // Entrada: request de tipo HttpRequestMessage y objeto de tipo Usuario
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción: Registra o inserta un nuevo Usuario.
        [HttpPost]
        [Route("Registrar")]
        public async Task<HttpResponseMessage> Registrar(HttpRequestMessage request, Usuario model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _usuarioservice.InsertarUsuario(model, out message);
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

        // Entrada: request de tipo HttpRequestMessage y objeto de tipo Usuario.
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción: Actualiza el registro del Usuario en la base de datos con el objeto Usuario proporcionado.
        [HttpPut]
        [Route("Actualizar")]
        public async Task<HttpResponseMessage> ActualizarUsuario(HttpRequestMessage request, Usuario model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _usuarioservice.UpdateUsuario(model, out message);
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

        // Entrada: request de tipo HttpRequestMessage y objeto de tipo Usuario.
        // Salida: respuesta de tipo HttpResponseMessage.
        // Descripción: Efectúa eliminación lógica del objeto Usuario proporcionado.
        [HttpPut]
        [Route("EliminarUsuario")]
        public async Task<HttpResponseMessage> EliminarUsuario(HttpRequestMessage request, Usuario model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _usuarioservice.EliminarUsuario(model, out message);
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

        // Entrada: request de tipo HttpRequestMessage
        // Salida: respuesta de tipo HttpResponseMessage y ID de tipo INT
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
                    int resultadoID = _usuarioservice.ObtenerIDRegistro(out message);
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
        //G: METODO PARA ENVIAR CODIGO DE CONFIRMACION AL CORREO AL MOMENTO DE REGISTRAR USUARIO O REESTABLECER CONTRASEÑA
        [HttpPost]
        [Route("Send/{code:int}")]
        public async Task<HttpResponseMessage> SendMail(HttpRequestMessage request, Usuario model, int code)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _usuarioservice.SendMail(model, out message, code);
                        response = request.CreateResponse(HttpStatusCode.OK, message);
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
        //G: UN GET PARA OBTENER UUARIOS POR LOGIN, ESTO PARA VERIFICAR UE EL USUARIO NO EXISTE ANTES DEL REGISTRO
        [Route("GetUsuarioByLogin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetUsuario(HttpRequestMessage request, string loginUsuario)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var usuario = _usuarioservice.GetUsuario(loginUsuario);

                    response = request.CreateResponse(HttpStatusCode.OK, usuario);
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
        //METODO PARA VERIFICAR SI EL CORREO EXISTE O NO
        [Route("GetUsuarioByEmail")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetUsuarioByEmail(HttpRequestMessage request, string correoUsuario)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var usuario = _usuarioservice.GetUsuarioEmail(correoUsuario);

                    response = request.CreateResponse(HttpStatusCode.OK, usuario);
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
        //METODO PARA VERIFICAR SI EL TELEFONO EXISTE O NO
        [Route("GetUsuarioByTel")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetUsuarioByTelefono(HttpRequestMessage request, string telefonoUsuario)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var usuario = _usuarioservice.GetUsuarioTel(telefonoUsuario);

                    response = request.CreateResponse(HttpStatusCode.OK, usuario);
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