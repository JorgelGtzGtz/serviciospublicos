using dbconnection;
using ServiciosPublicos.Core.Entities;
using ServiciosPublicos.Core.Factories;
using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Repository
{
    public interface IUsuarioRepository : IRepositoryBase<Usuario>
    {
        List<dynamic> GetByDynamicFilter(Sql sql);
        Usuario GetUsuario(string usr, string password);
        Usuario GetUsuario(string usr);
    }

    public class UsuarioRepository : RepositoryBase<Usuario>, IUsuarioRepository
    {
        public UsuarioRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        public Usuario GetUsuario(string usr, string password)
        {
            var query = new Sql()
                .Select("*")
                .From("Usuarios")
                .Where("lower(Usuario) = @0 and Contrasena = @1", usr.ToLower(), password);

            var user = this.Context.SingleOrDefault<Usuario>(query);

            return user;
        }

        public Usuario GetUsuario(string usr)
        {
            var query = new Sql()
                .Select("*")
                .From("Usuarios")
                .Where("lower(Usuario) = @0", usr.ToLower());

            var user = this.Context.SingleOrDefault<Usuario>(query);

            return user;
        }

        public List<dynamic> GetByDynamicFilter(Sql sql)
        {
            return this.Context.Fetch<dynamic>(sql);
        }
    }
}
