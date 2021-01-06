using ServiciosPublicos.Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Services
{
    public interface IImagenService
    {

    }
    public class ImagenService: IImagenService
    {
        private readonly IImagenRepository _ImagenRepository;

        public ImagenService(IImagenRepository imagenRepository)
        {
            _ImagenRepository = imagenRepository;
        }
    }
}
