using dbServiciosPublicos;
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
        List<Usuario> GetUsuarioJefeDisponible(int idTipoJefe);
    }

    public class UsuarioRepository : RepositoryBase<Usuario>, IUsuarioRepository
    {
        public UsuarioRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

       
        public int getUltimoID()
        {            
            var query = new Sql(@"SELECT IDENT_CURRENT('Usuario')");
            return this.Context.Execute(query);
        }

        public Usuario GetUsuario(string usr, string password)
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Usuario")
                .Where("lower(Login_usuario) = @0 and Password_usuario = @1", usr.ToLower(), password);

            var user = this.Context.SingleOrDefault<Usuario>(query);

            return user;
        }

        public Usuario GetUsuario(string usr)
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Usuario")
                .Where("lower(Login_usuario) = @0", usr.ToLower());

            var user = this.Context.SingleOrDefault<Usuario>(query);

            return user;
        }
       
        public List<dynamic> GetByDynamicFilter(Sql sql)
        {
            return this.Context.Fetch<dynamic>(sql);
        }

        public List<Usuario> GetUsuarioJefeDisponible(int idTipoJefe)
        {
            Sql query = new Sql()
                .Select("*").From("hiram74_residencias.Usuario")
                .Where("ID_tipoUsuario = @0 AND Jefe_asignado = 0", idTipoJefe);
            return this.Context.Fetch<Usuario>(query);
        }

        public List<dynamic> GetUsuariosFiltroGeneral(string textoBusqueda = null)
        {
            string filter = " Where ";

            if (!string.IsNullOrEmpty(textoBusqueda))
            {
                filter += string.Format("usuario.Nombre_usuario like '%{0}%' or " +
                                        "usuario.Login_usuario like '%{0}%' or " +
                                        "usuario.ID_usuario like '%{0}%' or " +
                                        "tipoUsuario.Descripcion_tipoUsuario like '%{0}%'", textoBusqueda);
            }

            Sql query = new Sql(@"select usuario.*, tipoUsuario.Descripcion_tipoUsuario as NombreTipo
                                from  [hiram74_residencias].[Usuario] usuario
                                inner join [hiram74_residencias].[Tipo_usuario] tipoUsuario 
                                on tipoUsuario.ID_tipoUsuario = usuario.ID_tipoUsuario" + (!string.IsNullOrEmpty(textoBusqueda) ? filter : ""));
            return this.Context.Fetch<dynamic>(query);            
        }

        
    }
}
