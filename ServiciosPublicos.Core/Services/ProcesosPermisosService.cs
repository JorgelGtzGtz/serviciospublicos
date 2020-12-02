using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using dbServiciosPublicos;
using ServiciosPublicos.Core.Repository;

namespace ServiciosPublicos.Core.Services
{
    public interface IProcesosPermisosService 
    {
        List<Procesos_Permiso> GetProcesos();


    }
    public class ProcesosPermisosService : IProcesosPermisosService
    {
        private readonly IProcesosPermisosRepository _procesosPermisosRepository;
        public ProcesosPermisosService(IProcesosPermisosRepository procesosPermisosRepository)
        {
            _procesosPermisosRepository = procesosPermisosRepository;

        }

        public List<Procesos_Permiso> GetProcesos()
        {
            return _procesosPermisosRepository.GetProcesosPermisos();
        }
    }
}
