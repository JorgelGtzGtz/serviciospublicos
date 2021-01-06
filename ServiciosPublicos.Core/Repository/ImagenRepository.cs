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
        void InsertarImagen(int idReporte, Imagen imagen, int idTicket = 0);
        // void InsertarImagenCierre(int idReporte, Imagen imagen);
        List<Imagen> GetImagenTickets(int idTicket);
    }
    public class ImagenRepository : RepositoryBase<Imagen>, IImagenRepository
    {
        public ImagenRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        // Entrada: ID de reporte de tipo INT y valor INT de tipo de Imagen
        // Salida: Ninguna
        // Descripción: Devuelve la lista de imagenes que estan relacionadas con un reporte
        public List<Imagen> GetImagen(int idReporte, int tipoImagen)
        {
            Sql query = new Sql(@"SELECT * FROM Imagen 
                                WHERE ID_reporte = @0 AND Tipo_imagen = @1", idReporte, tipoImagen);
            return this.Context.Fetch<Imagen>(query);
        }
        //G: METODO PARA OBTENER LAS IMAGENES DE TICKET ESTO PARA VERLAS EN LA APP DE LADO PUBLICO
        public List<Imagen> GetImagenTickets(int idTicket)
        {
            Sql query = new Sql(@"SELECT * FROM Imagen 
                                WHERE ID_ticket = @0 AND Tipo_imagen = 1", idTicket);
            return this.Context.Fetch<Imagen>(query);
        }

        // Entrada: ID de reporte de tipo INT, Imagen de tipo Imagen y ID de Ticket de tipo INT (opcional)
        // Salida: Ninguna
        // Descripción: Llama a método del repositorio para insertar nueva imagen en base de datos
        // relacionandola con un reporte y ticket o solo reporte.
        public void InsertarImagen(int idReporte, Imagen imagen, int idTicket = 0 )
        {
            imagen.ID_reporte = idReporte;
            if (idTicket == 0)
            {
                imagen.ID_ticket = null;
            }
            else
            {
                imagen.ID_ticket = idTicket;
            }
            this.Add<int>(imagen);
        }

        // Entrada: ID de reporte de tipo INT 
        // Salida: Lista de Imagenes.
        // Descripción: Obtener imagenes del reporte
       /* public void InsertarImagenCierre(int idReporte, Imagen imagen)
        {            
            imagen.ID_reporte = idReporte;
            imagen.ID_ticket = null;
            this.Add<int>(imagen);
        }
       */
    }
}
