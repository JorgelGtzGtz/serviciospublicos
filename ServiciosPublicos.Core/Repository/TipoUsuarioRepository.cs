using dbServiciosPublicos;
using PetaPoco;
using ServiciosPublicos.Core.Factories;

namespace ServiciosPublicos.Core.Repository
{
    
    public interface ITipoUsuarioRepository : IRepositoryBase<Tipo_usuario>
    {
        Tipo_usuario GetTipo(string nombre);
    }

    public class TipoUsuarioRepository : RepositoryBase<Tipo_usuario>, ITipoUsuarioRepository
    {
        public TipoUsuarioRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        public Tipo_usuario GetTipo( string nombre)
        {
            Sql query = new Sql(@"SELECT * FROM Tipo_usuario WHERE
                                    Descripcion_tipoUsuario = @0",nombre);
            return this.Context.SingleOrDefault<Tipo_usuario>(query);

        }
    }
    
}
