using dbServiciosPublicos;
using ServiciosPublicos.Core.Entities;
using ServiciosPublicos.Core.Factories;
using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EASendMail;

namespace ServiciosPublicos.Core.Repository
{
    public interface IUsuarioRepository : IRepositoryBase<Usuario>
    {
        List<dynamic> GetByDynamicFilter(Sql sql);
        Usuario GetUsuario(string usr, string password);
        Usuario GetUsuario(string usr);
        Usuario GetUsuarioByEmail(string email);
        Usuario GetUsuarioByPhone(string telefono);
        List<Usuario> GetUsuariosPorTipo(int tipoUsuario);
        List<Usuario> GetUsuarioJefeDisponible(int idTipoJefe);
        List<dynamic> GetUsuariosFiltroDinamico(string textoBusqueda, string estado, string tipoU, string repActivos);
        int GetUltimoID();
        string EnviarCorreo(string correoDestino, string asunto, string mensajeCorreo);
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
            var query = new Sql(@"SELECT * FROM hiram74_residencias.Usuario 
                                  WHERE Login_usuario = @0 
                                  AND Password_usuario = @1 
                                  AND Disponible = 1", usr.ToLower(), password);

            var user = this.Context.SingleOrDefault<Usuario>(query);

            return user;
        }
        //G: METODO PARA ENVIAR CORREO
        //USA UN CORREO ESPECIFICAMENTE CREADO PARA ESTO EL CUAL ES EL UE SE ENCARGA DE ENVIAR CORREOS A LOS DESTINATARIOS
        //TODA LA INFORMACION DEL CORREO ESTA EN EL METODO
        public string EnviarCorreo(string correoDestino, string asunto, string mensajeCorreo)
        {
            string mensaje = "Error al enviar correo.";

            try
            {
                SmtpMail objetoCorreo = new SmtpMail("TryIt");

                objetoCorreo.From = "publicosservicios745@gmail.com";
                objetoCorreo.To = correoDestino;
                objetoCorreo.Subject = asunto;
                objetoCorreo.TextBody = mensajeCorreo;

                SmtpServer objetoServidor = new SmtpServer("smtp.gmail.com");

                objetoServidor.User = "publicosservicios745@gmail.com";
                objetoServidor.Password = "public329";
                objetoServidor.Port = 587;
                objetoServidor.ConnectType = SmtpConnectType.ConnectSSLAuto;

                SmtpClient objetoCliente = new SmtpClient();
                objetoCliente.SendMail(objetoServidor, objetoCorreo);
                mensaje = "Correo Enviado Correctamente.";


            }
            catch (Exception ex)
            {
                mensaje = "Error al enviar correo." + ex.Message;
            }
            return mensaje;
        }

        public Usuario GetUsuario(string usr)
        {
            var query = new Sql(@"SELECT * FROM hiram74_residencias.Usuario 
                                  WHERE Login_usuario = @0 AND Disponible = 1", usr.ToLower());

            var user = this.Context.SingleOrDefault<Usuario>(query);

            return user;
        }

        public Usuario GetUsuarioByEmail(string email)
        {
            var query = new Sql(@"SELECT * FROM hiram74_residencias.Usuario 
                                  WHERE Correo_usuario = @0 AND Disponible = 1", email.ToLower());

            var user = this.Context.SingleOrDefault<Usuario>(query);

            return user;
        }

        public Usuario GetUsuarioByPhone(string telefono)
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Usuario")
                .Where("lower(Telefono_usuario) = @0", telefono.ToLower());

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


            filter += "usuario.Disponible = 1 ";
            if (!string.IsNullOrEmpty(textoBusqueda))
            {
                filter += string.Format(" AND (usuario.Nombre_usuario like '%{0}%' or " +
                                        "usuario.Login_usuario like '%{0}%' or " +
                                        "usuario.ID_usuario like '%{0}%' or " +
                                        "tipoUsuario.Descripcion_tipoUsuario like '%{0}%')", textoBusqueda);
                
            }

            if (!string.IsNullOrEmpty(estado))
            {
                filter += string.Format(" AND Estatus_usuario LIKE '%{0}%'", estado);
                
            }

            if (!string.IsNullOrEmpty(tipoU))
            {
                filter += string.Format(" AND usuario.ID_tipoUsuario LIKE '%{0}%'", tipoU);
                
            }

            if (!string.IsNullOrEmpty(repActivos))
            {
                filter += string.Format(" AND 0 < (SELECT COUNT(ticket.ID_ticket) FROM[Ticket] ticket " +
                                         "WHERE ticket.ID_usuarioReportante = usuario.ID_usuario " +
                                          "AND (ticket.Estatus_ticket != 4 AND ticket.Estatus_ticket != 2))", repActivos);
                
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
