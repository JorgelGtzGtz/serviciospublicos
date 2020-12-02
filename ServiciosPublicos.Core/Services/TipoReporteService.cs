using dbServiciosPublicos;
using ServiciosPublicos.Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Services
{
    public interface ITipoReporteService
    {
        List<Tipo_Reporte> GetTipos();
    }
    public class TipoReporteService : ITipoReporteService
    {
        private readonly ITipoReporteRepository _tipoReporteRepository;

        public TipoReporteService(ITipoReporteRepository tipoReporteRepository)
        {
            _tipoReporteRepository = tipoReporteRepository;
        }

        public List<Tipo_Reporte> GetTipos()
        {
            return _tipoReporteRepository.GetAll("Tipo_Reporte").ToList();
        }

    }
}
