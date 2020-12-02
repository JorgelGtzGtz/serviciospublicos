using dbServiciosPublicos;
using ServiciosPublicos.Core.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Repository
{
    public interface ITipoReporteRepository : IRepositoryBase<Tipo_Reporte>
    {

    }
    public class TipoReporteRepository: RepositoryBase<Tipo_Reporte>, ITipoReporteRepository
    {
        public TipoReporteRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}
