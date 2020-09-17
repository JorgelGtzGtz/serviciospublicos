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
    [RoutePrefix("api/Compras")]
    public class ComprasController : BaseApiController
    {

        private readonly IComprasService _comprasService;
        private readonly IListaCombosService _listaCombosService;
        private readonly IKardexService _kardexService;

        public ComprasController(IComprasService comprasService, IListaCombosService listaCombosService, IKardexService kardexService)
        {
            _comprasService = comprasService;
            _listaCombosService = listaCombosService;
            _kardexService = kardexService;
        }

        [HttpGet]
        [Route("Lista/{from?}/{to?}/{proveedor:int=0}/{folio?}/{factura?}")]
        public async Task<HttpResponseMessage> Lista(HttpRequestMessage request, string from, string to, int? proveedor, string folio = "", string factura = "")
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

                    var item = _comprasService.GetComprasFiltro(from, to, proveedor, folio, factura);
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

        [Route("GetCompra/{id:int=0}/")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetCompra(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var model = _comprasService.GetCompra(id);
                    var detalles = _comprasService.GetCompraDetalles(id);
                    response = request.CreateResponse(HttpStatusCode.OK, new {  model, detalles });
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
                    List<ComprasDetalle> detalles = new List<ComprasDetalle>();
                    var model = data["model"].ToObject<Compra>();
                    detalles = data["detalles"].ToObject<List<ComprasDetalle>>();

                    if (model.ID <= 0)
                    {
                        model.Estatus = "G";
                    }
                        
                    var result = _comprasService.InsertUpdateCompra(model, detalles, UserLogged.UserID, out message);
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
        [Route("Cancelar/{id}")]
        public async Task<HttpResponseMessage> Cancelar(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _comprasService.CancelarCompra(id, UserLogged.UserID, out message);
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
                    var proveedores = _listaCombosService.GetProveedores();

                    response = request.CreateResponse(HttpStatusCode.OK, new { productos, proveedores, almacenes });
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