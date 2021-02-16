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
    public interface ISectorRepository : IRepositoryBase<Sector>
    {
        Sector GetSectorPorNombre(string nombre);
        List<Sector> filtroDinamicoSector(string textoB, string estado);
        List<Sector> GetSectoresList();
        int ObtenerUltimoID();
    }
    public class SectorRepository : RepositoryBase<Sector>, ISectorRepository
    {
        public SectorRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        // Entrada: nombre sector de tipo string.
        // Salida: Objeto de tipo Sector.
        // Descripción: Buscar sector por nombre.
        public Sector GetSectorPorNombre(string nombre)
        {
            Sql query = new Sql(@"SELECT * FROM Sector WHERE  
                                Descripcion_sector= @0 AND Disponible = 1", nombre);
            return this.Context.SingleOrDefault<Sector>(query);
        }

        // Entrada: string con texto de búsqueda y string con estado de sector.
        // Salida: Lista de tipo Sector.
        // Descripción: query para búsqueda de sectores, de acuerdo a determinados filtros.
        public List<Sector> filtroDinamicoSector(string textoB, string estado)
        {
            string filter = " WHERE ";
            bool operacion = false;
            filter += "Disponible = 1 ";
            if (!string.IsNullOrEmpty(textoB))
            {
                filter += string.Format(" AND ID_sector LIKE '%{0}%' OR " +
                                        "Descripcion_sector LIKE '%{0}%'", textoB);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(estado))
            {
                filter += string.Format(" AND Estatus_sector LIKE '%{0}%'", estado);
                operacion = true;
            }

            Sql query = new Sql(@"SELECT * FROM Sector" + filter);
            return this.Context.Fetch<Sector>(query);
        }

        // Entrada: Ninguna.
        // Salida: Lista de tipo Sector.
        // Descripción: Query para obtener los registros de tabla sector que no han sido eliminados (eliminación lógica)
        public List<Sector> GetSectoresList()
        {
            Sql query = new Sql()
                .Select("*")
                .From("Sector")
                .Where("Disponible = 1");
            return this.Context.Fetch<Sector>(query);
        }

        // Entrada: Ninguna
        // Salida: Ultimo ID registrado en base de datos de tipo INT.
        // Descripción: Obtiene el ID del último registro de la tabla Sector en la base de datos.
        public int ObtenerUltimoID()
        {
            Sql query = new Sql(@"SELECT IDENT_CURRENT('Sector')");
            return this.Context.SingleOrDefault<int>(query);
        }



    }
}
