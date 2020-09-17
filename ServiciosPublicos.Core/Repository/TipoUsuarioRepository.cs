using dbconnection;
using ServiciosPublicos.Core.Factories;

namespace ServiciosPublicos.Core.Repository
{
    public interface ITipoUsuarioRepository : IRepositoryBase<TiposUsuario>
    {
    }

    public class TipoUsuarioRepository : RepositoryBase<TiposUsuario>, ITipoUsuarioRepository
    {
        public TipoUsuarioRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}
