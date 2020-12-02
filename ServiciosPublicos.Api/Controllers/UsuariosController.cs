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

        [HttpGet]
        [Route("Lista/{usuario?}/")]
        public async Task<HttpResponseMessage> GetUsuarios(HttpRequestMessage request, string usuario = null)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var item = _usuarioservice.GetUsuariosFiltro(usuario);
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

        
        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<HttpResponseMessage> EliminarUsuario(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _usuarioservice.EliminarUsuario(id, out message);
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
    }
}