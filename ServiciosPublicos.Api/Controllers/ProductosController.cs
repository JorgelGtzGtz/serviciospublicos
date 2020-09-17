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
    [RoutePrefix("api/Productos")]
    public class ProductosController : BaseApiController
    {
        private readonly IProductosService _productoService;
        private readonly IListaCombosService _listaCombosService;

        public ProductosController(IProductosService productoService, IListaCombosService listaCombosService)
        {
            _productoService = productoService;
            _listaCombosService = listaCombosService;
        }

        [HttpGet]
        [Route("Lista/{producto?}/")]
        public async Task<HttpResponseMessage> Lista(HttpRequestMessage request, string producto = null)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var item = _productoService.GetProductosFiltro(producto);
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

        [Route("GetProducto/{id:int=0}/")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetProducto(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var model = _productoService.GetProducto(id);
                    var kit = _productoService.GetProductosKit(id);
                    response = request.CreateResponse(HttpStatusCode.OK, new { producto = model, kit = kit });
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
                    List<ProductosDetalleKit> productoKits = new List<ProductosDetalleKit>();
                    var producto = data["producto"].ToObject<Producto>();
                    if (producto?.Kit ?? false)
                    {
                        productoKits = data["productoskit"].ToObject<List<ProductosDetalleKit>>();
                    }

                    var result = _productoService.InsertUpdateProducto(producto, out message, producto?.Kit ?? false ? productoKits : null);
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
                    var result = _productoService.EliminarProducto(id, out message);
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

        [HttpGet]
        [Route("Combos")]
        public async Task<HttpResponseMessage> GetListasCombos(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var marcas = _listaCombosService.GetMarcas();
                    var modelos = _listaCombosService.GetModelos();
                    var colores = _listaCombosService.GetColores();
                    var tipos = _listaCombosService.GetTiposLente();
                    var material = _listaCombosService.GetMaterialesLente();
                    var colorlente = _listaCombosService.GetColoresLente();
                    var productos = _listaCombosService.GetProductos();

                    response = request.CreateResponse(HttpStatusCode.OK, new { marcas, modelos, colores, tipos, material , colorlente, productos });
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