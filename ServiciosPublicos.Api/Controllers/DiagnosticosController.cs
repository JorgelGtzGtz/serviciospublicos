using dbconnection;
using Newtonsoft.Json.Linq;
using CredFecere.Core.Entities;
using CredFecere.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace CredFecere.Api.Controllers
{
    [RoutePrefix("api/Diagnosticos")]
    public class DiagnosticosController : BaseApiController
    {
        private readonly IDiagnosticosService _diagnosticosService;
        private readonly IListaCombosService _listaCombosService;

        public DiagnosticosController(IDiagnosticosService diagnosticosService, IListaCombosService listaCombosService)
        {
            _diagnosticosService = diagnosticosService;
            _listaCombosService = listaCombosService;
        }

        [HttpGet]
        [Route("Lista/{from?}/{to?}/{paciente:int=0}/{opto:int=0}/{folio?}")]
        public async Task<HttpResponseMessage> Lista(HttpRequestMessage request, string from, string to, int? paciente, int? opto, string folio = "")
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var item = _diagnosticosService.GetDiagnosticosFiltro(from, to, paciente, opto, folio);
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

        [Route("GetDiagnostico/{id:int=0}/")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetColorLente(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var model = _diagnosticosService.GetDiagnostico(id);

                    response = request.CreateResponse(HttpStatusCode.OK, model);
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
        public async Task<HttpResponseMessage> Guardar(HttpRequestMessage request, Diagnostico data)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    if (data.ID <= 0)
                    {
                        data.ID_Sucursal = UserLogged.SucursalID;
                    }

                    var result = _diagnosticosService.InsertUpdateDiagnostico(data, UserLogged.UserID, out message);
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

        [Route("Combos")]
        public async Task<HttpResponseMessage> GetCombos(HttpRequestMessage request)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var pacientes = _listaCombosService.GetPacientes();
                    var optometristas = _listaCombosService.GetUsuariosOptometrista();
                    var tiposlente = _listaCombosService.GetTiposLente();
                    var materiales = _listaCombosService.GetMaterialesLente();
                    var coloreslente = _listaCombosService.GetColoresLente();

                    response = request.CreateResponse(HttpStatusCode.OK, new { pacientes, optometristas, tiposlente, materiales, coloreslente });
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