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
        List<dynamic> filtroDinamicoSector(string textoB, string estado);
        List<Sector> GetSectoresList();
        int ObtenerUltimoID();
    }
    public class SectorRepository : RepositoryBase<Sector>, ISectorRepository
    {
        public SectorRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        // Búsqueda de sectores, de acuerdo a determinados filtros.
        public List<dynamic> filtroDinamicoSector(string textoB, string estado)
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
            return this.Context.Fetch<dynamic>(query);
        }

        public List<Sector> GetSectoresList()
        {
            Sql query = new Sql()
                .Select("*")
                .From("Sector")
                .Where("Disponible = 1");
            return this.Context.Fetch<Sector>(query);
        }

        public int ObtenerUltimoID()
        {
            Sql query = new Sql(@"SELECT IDENT_CURRENT('Sector')");
            return this.Context.SingleOrDefault<int>(query);
        }



    }
}
