using dbconnection;
using Newtonsoft.Json.Linq;
using CredFecere.Core.Entities;
using CredFecere.Core.Services;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace CredFecere.Api.Controllers
{
    [RoutePrefix("api/Ventas")]
    public class VentasController : BaseApiController
    {

        private readonly IVentasService _ventasService;
        private readonly IUsuarioService _usuarioservice;
        private readonly IListaCombosService _listaCombosService;
        private readonly IKardexService _kardexService;

        public VentasController(IVentasService ventasService, IListaCombosService listaCombosService, IKardexService kardexService, IUsuarioService usuarioservice)
        {
            _ventasService = ventasService;
            _listaCombosService = listaCombosService;
            _kardexService = kardexService;
            _usuarioservice = usuarioservice;
        }

        [HttpGet]
        [Route("Lista/{from?}/{to?}/{idcliente:int=0}/{idsucursal:int=0}/{idvendedor:int=0}/{idproducto:int=0}/{folio?}/{folioalt?}")]
        public async Task<HttpResponseMessage> Lista(HttpRequestMessage request, string from, string to, int? idcliente, int? idsucursal, int? idvendedor, int? idproducto, string folio = "", string folioalt = "")
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    int? idSucursal = null;
                    if (UserLogged.SuperAdmin != null && !UserLogged.SuperAdmin.Value)
                    {
                        idSucursal = UserLogged.SucursalID;
                    }

                    if (idsucursal == null)
                    {
                        idSucursal = UserLogged.SucursalID;
                    }

                    var item = _ventasService.GetVentasFiltro(from, to, idcliente, idsucursal, idvendedor, idproducto, folio, folioalt);
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

        [Route("GetVenta/{id:int=0}/")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetVenta(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var model = _ventasService.GetVenta(id);
                    var detalles = _ventasService.GetVentaDetalles(id);
                    response = request.CreateResponse(HttpStatusCode.OK, new { model, detalles });
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
        public async Task<HttpResponseMessage> Guardar(HttpRequestMessage request, [FromBody] JObject data)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    List<VentasDetalle> detalles = new List<VentasDetalle>();
                    var model = data["model"].ToObject<Venta>();
                    detalles = data["detalles"].ToObject<List<VentasDetalle>>();
                    var accion = data["accion"].ToObject<string>();

                    if (model.ID <= 0)
                    {
                        model.Estatus = "G";
                    }

                    var result = _ventasService.InsertUpdateVenta(model, detalles, UserLogged.UserID, out message);
                    if (result)
                    {
                        if (accion == "P")
                        {
                            var resultProcesar = _kardexService.ProcesarVenta(model.ID, UserLogged.UserID, out message);
                            if (result && resultProcesar)
                            {
                                response = request.CreateResponse(HttpStatusCode.OK, new { ID = result });
                            }
                            else
                            {
                                response = request.CreateResponse(HttpStatusCode.BadRequest,
                                            new
                                            {
                                                error = "ERROR",
                                                message = "Venta guadada con exito, no se pudo procesar intentarlo manualmente. Error: " + message
                                            });
                            }
                        }
                        else
                        {
                            response = request.CreateResponse(HttpStatusCode.OK, new { ID = result });
                        }
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

        [HttpPost]
        [Route("Cancelar/{id}")]
        public async Task<HttpResponseMessage> Cancelar(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _ventasService.CancelarVenta(id, UserLogged.UserID, out message);
                    if (result)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { ID = result });
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

        [HttpPost]
        [Route("Procesar/{id}")]
        public async Task<HttpResponseMessage> Procesar(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _kardexService.ProcesarCompra(id, UserLogged.UserID, out message);
                    if (result)
                    {
                        response = request.CreateResponse(HttpStatusCode.OK, new { ID = result });
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

        [HttpPost]
        [Route("Autorizar")]
        public async Task<HttpResponseMessage> Autorizar(HttpRequestMessage request, [FromBody] JObject data)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    List<ComprasDetalle> detalles = new List<ComprasDetalle>();
                    var usuario = data["usuario"].ToObject<string>();
                    var password = data["password"].ToObject<string>();

                    var op = _usuarioservice.GetUsuario(usuario, password);

                    if (op != null)
                    {
                        if (op.SuperAdmin)
                        {
                            response = request.CreateResponse(HttpStatusCode.OK, new { Autorizado = true });
                        }
                        else
                        {
                            response = request.CreateResponse(HttpStatusCode.BadRequest,
                            new
                            {
                                error = "ERROR",
                                message = "Usuario no tiene derechos para autorizar."
                            });
                        }

                    }
                    else
                    {
                        response = request.CreateResponse(HttpStatusCode.BadRequest,
                        new
                        {
                            error = "ERROR",
                            message = "Usuario o contraseña invalidas, Intente de nuevo."
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

        [Route("Combos")]
        public async Task<HttpResponseMessage> GetCombos(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var productos = _listaCombosService.GetProductos();
                    var almacenes = _listaCombosService.GetAlmacenesDeSucursal(UserLogged.SucursalID);
                    var sucursales = (UserLogged.SuperAdmin != null && UserLogged.SuperAdmin.Value) ? _listaCombosService.GetSucursales() : _listaCombosService.GetSucursalesUsuario(UserLogged.SucursalID);
                    var clientes = _listaCombosService.GetClientes();
                    var vendedores = _listaCombosService.GetUsuariosVendedorPorSucursal(UserLogged.SucursalID);
                    var metodospago = _listaCombosService.GetMetodosPago();

                    response = request.CreateResponse(HttpStatusCode.OK, new { productos, almacenes, sucursales, clientes, vendedores, metodospago });
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