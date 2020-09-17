using dbconnection;
using Newtonsoft.Json.Linq;
using CredFecere.Core.Entities.Dto;
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
    [RoutePrefix("api/GenerarProductoKit")]
    public class GenerarProductoKitController : BaseApiController
    {

        private readonly IProductosService _productosService;
        private readonly IListaCombosService _listaCombosService;

        public GenerarProductoKitController(IProductosService productosService, IListaCombosService listaCombosService)
        {
            _productosService = productosService;
            _listaCombosService = listaCombosService;
        }

        [HttpPost]
        [Route("Generar")]
        public async Task<HttpResponseMessage> Guardar(HttpRequestMessage request, GenerarKitDto model)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _productosService.GenerarProductoKIT(model, UserLogged.UserID, out message);
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
        [Route("ListaDetallesKit")]
        public async Task<HttpResponseMessage> ListaDetallesKit(HttpRequestMessage request, [FromBody] JObject data)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    int idalmacen = data["idalmacen"].ToObject<int>();
                    int idproducto = data["idproductobase"].ToObject<int>();
                    int cantidad = data["cantidad"].ToObject<int>();

                    var lista = _productosService.GetListaDetallesKit(idproducto, idalmacen, cantidad);

                    response = request.CreateResponse(HttpStatusCode.OK, lista);

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
                    var productos = _listaCombosService.GetProductosKit();
                    var almacenes = _listaCombosService.GetAlmacenesDeSucursal(UserLogged.SucursalID);

                    response = request.CreateResponse(HttpStatusCode.OK, new { productos, almacenes });
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