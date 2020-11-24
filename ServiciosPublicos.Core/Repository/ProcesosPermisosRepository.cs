using dbServiciosPublicos;
using PetaPoco;
using ServiciosPublicos.Core.Entities;
using ServiciosPublicos.Core.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Repository
{
    public interface IProcesosPermisosRepository : IRepositoryBase<Procesos_Permiso>
    {
        List<Procesos_Permiso> GetProcesosPermisos();
    }

    public class ProcesosPermisosRepository : RepositoryBase<Procesos_Permiso>, IProcesosPermisosRepository
    {
        public ProcesosPermisosRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        public List<Procesos_Permiso> GetProcesosPermisos()
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Procesos_Permisos");
            var procesos = this.Context.Fetch<Procesos_Permiso>(query);

            return procesos;
        }
    }
}
