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
        List<Usuario> GetUsuariosPorTipo(int tipoUsuario);
        List<Usuario> GetUsuarioJefeDisponible(int idTipoJefe);
        List<dynamic> GetUsuariosFiltroDinamico(string textoBusqueda, string estado, string tipoU, string repActivos);
        int GetUltimoID();
    }

    public class UsuarioRepository : RepositoryBase<Usuario>, IUsuarioRepository
    {
        public UsuarioRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }


        // Entrada: string de usuario y string de contraseña.
        // Salida: objeto de tipo Usuario.
        // Descripción: Query para buscar Usuario por su usuario y contraseña.
        public Usuario GetUsuario(string usr, string password)
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Usuario")
                .Where("lower(Login_usuario) = @0 and Password_usuario = @1", usr.ToLower(), password);

            var user = this.Context.SingleOrDefault<Usuario>(query);

            return user;
        }

        // Entrada: valor string para usuario.
        // Salida: objeto de tipo Usuario.
        // Descripción: Query para obtener un Usuario que cuyo valor de Login_usuario
        // coincida con el proporcionado.
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

        // Entrada: ID de tipo de Usuario de tipo INT
        // Salida: Lista de tipo Usuario.
        // Descripción: Query para consultar usuarios cuyo tipo de usuario sea de Jefe de cuadrilla y no estén
        // asignados a ninguna cuadrilla.
        public List<Usuario> GetUsuarioJefeDisponible(int idTipoJefe)
        {
            Sql query = new Sql()
                .Select("*").From("hiram74_residencias.Usuario")
                .Where("ID_tipoUsuario = @0 AND Jefe_asignado = 0", idTipoJefe);
            return this.Context.Fetch<Usuario>(query);
        }

        // Entrada: string para texto de búsqueda, string para estado de usuario, string para tipo de usuario y 
        //          string para reportes activos.
        // Salida: lista de tipo Dynamic con los registros de usuario.
        // Descripción: query para obtener los registros de usuario y su tipo de usuario de los registros que coincidan
        // con los filtros de búsqueda.
        public List<dynamic> GetUsuariosFiltroDinamico(string textoBusqueda, string estado, string tipoU, string repActivos)
        {
            string filter = " WHERE ";
            bool operacion = false;


            filter += "usuario.Disponible = 1 ";
            if (!string.IsNullOrEmpty(textoBusqueda))
            {
                filter += string.Format(" AND (usuario.Nombre_usuario like '%{0}%' or " +
                                        "usuario.Login_usuario like '%{0}%' or " +
                                        "usuario.ID_usuario like '%{0}%' or " +
                                        "tipoUsuario.Descripcion_tipoUsuario like '%{0}%')", textoBusqueda);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(estado))
            {
                filter += string.Format(" AND Estatus_usuario LIKE '%{0}%'", estado);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(tipoU))
            {
                filter += string.Format(" AND usuario.ID_tipoUsuario LIKE '%{0}%'", tipoU);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(repActivos))
            {
                filter += string.Format(" AND 0 < (SELECT COUNT(ticket.ID_ticket) FROM[Ticket] ticket " +
                                         "WHERE ticket.ID_usuarioReportante = usuario.ID_usuario " +
                                          "AND ticket.Estatus_ticket LIKE '%{0}%')", repActivos);
                operacion = true;
            }

            Sql query = new Sql(@"SELECT usuario.*, tipoUsuario.Descripcion_tipoUsuario AS NombreTipo
                                FROM [hiram74_residencias].[Usuario] usuario
                                INNER JOIN [hiram74_residencias].[Tipo_usuario] tipoUsuario 
                                ON tipoUsuario.ID_tipoUsuario = usuario.ID_tipoUsuario " + filter);
            return this.Context.Fetch<dynamic>(query);
        }

        // Entrada: Ninguna
        // Salida: valor INT
        // Descripción: query para obtener el ID del último registro de la tabla Usuario en la base de datos.
        public int GetUltimoID()
        {
            Sql query = new Sql(@"SELECT IDENT_CURRENT('Usuario')");
            return this.Context.SingleOrDefault<int>(query);
        }


        // Entrada: ID de tipo de usuario
        // Salida: Lista de tipo Usuario.
        // Descripción: Query para obtener los usuarios cuyo ID de tipo de usuario
        // coincida con el proporcionado.
        public List<Usuario> GetUsuariosPorTipo(int tipoUsuario)
        {
            Sql query2 = new Sql()
                .Select("*").From("Usuario")
                .Where("ID_tipoUsuario = @0", tipoUsuario);
            return this.Context.Fetch<Usuario>(query2);
        }
    }
}
