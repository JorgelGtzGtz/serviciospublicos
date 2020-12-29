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
        List<Usuario> GetUsuarioJefeDisponible(int idTipoJefe);
        List<dynamic> GetUsuariosFiltroDinamico(string textoBusqueda, string estado, string tipoU, string repActivos);
        int ObtenerUltimoID();

        string EnviarCorreo(string correoDestino, string asunto, string mensajeCorreo);
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
                .From("hiram74_residencias.Usuario")
                .Where("lower(Login_usuario) = @0 and Password_usuario = @1", usr.ToLower(), password);

            var user = this.Context.SingleOrDefault<Usuario>(query);

            return user;
        }

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

       public List<dynamic> GetUsuariosFiltroDinamico(string textoBusqueda, string estado, string tipoU, string repActivos)
        {
            string filter = " WHERE ";
            bool operacion = false;

            if (!string.IsNullOrEmpty(textoBusqueda))
            {
                filter += string.Format("(usuario.Nombre_usuario like '%{0}%' or " +
                                        "usuario.Login_usuario like '%{0}%' or " +
                                        "usuario.ID_usuario like '%{0}%' or " +
                                        "tipoUsuario.Descripcion_tipoUsuario like '%{0}%')", textoBusqueda);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(estado))
            {
                filter += (operacion ? " AND " : "") + string.Format("Estatus_usuario LIKE '%{0}%'", estado);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(tipoU))
            {
                filter += (operacion ? " AND " : "") + string.Format("usuario.ID_tipoUsuario LIKE '%{0}%'", tipoU);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(repActivos))
            {
                filter += (operacion ? " AND " : "") + string.Format("0 < (SELECT COUNT(ticket.ID_ticket) FROM[Ticket] ticket " +
                                                                     "WHERE ticket.ID_usuarioReportante = usuario.ID_usuario " +
                                                                     "AND ticket.Estatus_ticket LIKE '%{0}%')", repActivos);
                operacion = true;
            }

            Sql query = new Sql(@"SELECT usuario.*, tipoUsuario.Descripcion_tipoUsuario AS NombreTipo
                                FROM [hiram74_residencias].[Usuario] usuario
                                INNER JOIN [hiram74_residencias].[Tipo_usuario] tipoUsuario 
                                ON tipoUsuario.ID_tipoUsuario = usuario.ID_tipoUsuario " + (operacion ? filter : ""));
            return this.Context.Fetch<dynamic>(query);
        }

        public int ObtenerUltimoID()
        {
            Sql query = new Sql(@"SELECT IDENT_CURRENT('Usuario')");
            return this.Context.SingleOrDefault<int>(query);
        }


    }
}
