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
    }
    public class SectorRepository : RepositoryBase<Sector>, ISectorRepository
    {
        public SectorRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        
    }
}
