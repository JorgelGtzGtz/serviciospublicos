using dbServiciosPublicos;
using PetaPoco;
using ServiciosPublicos.Core.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Repository
{
    public interface IImagenRepository : IRepositoryBase<Imagen>
    {
        List<Imagen> GetImagen(int idReporte, int tipoImagen);
        void InsertarImagen(int idTicket, int idReporte, Imagen imagen);
        void InsertarImagenCierre(int idReporte, Imagen imagen);
    }
    public class ImagenRepository : RepositoryBase<Imagen>, IImagenRepository
    {
        public ImagenRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        //Devuelve la lista de imagenes que estan relacionadas con un reporte
        public List<Imagen> GetImagen(int idReporte, int tipoImagen)
        {
            Sql query = new Sql(@"SELECT * FROM Imagen 
                                WHERE ID_reporte = @0 AND Tipo_imagen = @1", idReporte, tipoImagen);
            return this.Context.Fetch<Imagen>(query);
        }

        public void InsertarImagen(int idTicket, int idReporte, Imagen imagen)
        {
            imagen.ID_reporte = idReporte;
            imagen.ID_ticket = idTicket;
            this.Add<int>(imagen);
        }

        public void InsertarImagenCierre(int idReporte, Imagen imagen)
        {            
            imagen.ID_reporte = idReporte;
            imagen.ID_ticket = null;
            this.Add<int>(imagen);
        }
    }
}
