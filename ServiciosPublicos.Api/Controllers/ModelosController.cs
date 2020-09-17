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
    [RoutePrefix("api/Modelos")]
    public class ModelosController : BaseApiController
    {
        private readonly IModelosService _modelosService;


        public ModelosController(IModelosService modelosService)
        {
            _modelosService = modelosService;
        }

        [HttpGet]
        [Route("Lista/{modelo?}/")]
        public async Task<HttpResponseMessage> Lista(HttpRequestMessage request, string modelo = null)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var item = _modelosService.GetModelosFiltro(modelo);
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

        [Route("GetModelo/{id:int=0}/")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetModelo(HttpRequestMessage request, int id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var model = _modelosService.GetModelo(id);

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
        public async Task<HttpResponseMessage> Guardar(HttpRequestMessage request, Modelo data)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                try
                {
                    var result = _modelosService.InsertUpdateModelo(data, out message);
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
                    var result = _modelosService.EliminarModelo(id, out message);
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

        [HttpPost]
        [Route("uploadImagen")]
        public async Task<HttpResponseMessage> Upload(HttpRequestMessage request, int Id)
        {
            return await CreateHttpResponseAsync(request, async () =>
            {
                HttpResponseMessage response = null;
                string message = String.Empty;
                var context = HttpContext.Current.Request;
                try
                {
                    if (context.Files.Count > 0)
                    {
                        var filesReadToProvider = await Request.Content.ReadAsMultipartAsync();
                        var index = 0;
                        foreach (var streamContent in filesReadToProvider.Contents)
                        {
                            var fileBytes = await streamContent.ReadAsByteArrayAsync();
                            string FileName = context.Files[index].FileName;
                            string ImagePath = String.Format("/images/modelos/{0}", FileName);
                            var img = Image.FromStream(new System.IO.MemoryStream(fileBytes));
                            await SaveFiles(ImagePath, img);
                            index++;
                        }
                        return Request.CreateResponse(HttpStatusCode.OK);
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

        private async Task SaveFiles(string filePath, Image img)
        {
            // save thumb
            SaveToFolder(img, new Size(160, 160), filePath);
        }

        private void SaveToFolder(Image img, Size newSize, string pathToSave)
        {
            // Get new resolution
            Size imgSize = NewImageSize(img.Size, newSize);
            using (System.Drawing.Image newImg = new Bitmap(img, imgSize.Width, imgSize.Height))
            {
                // Remove image if already exist and save again
                if (System.IO.File.Exists(HttpContext.Current.Server.MapPath(pathToSave)))
                    System.IO.File.Delete(HttpContext.Current.Server.MapPath(pathToSave));

                newImg.Save(HttpContext.Current.Server.MapPath(pathToSave), img.RawFormat);
            }
        }

        private Size NewImageSize(Size imageSize, Size newSize)
        {
            Size finalSize;
            double tempval;
            if (imageSize.Height > newSize.Height || imageSize.Width > newSize.Width)
            {
                if (imageSize.Height > imageSize.Width)
                    tempval = newSize.Height / (imageSize.Height * 1.0);
                else
                    tempval = newSize.Width / (imageSize.Width * 1.0);

                finalSize = new Size((int)(tempval * imageSize.Width), (int)(tempval * imageSize.Height));
            }
            else
                finalSize = imageSize; // image is already small size

            return finalSize;
        }
    }
}