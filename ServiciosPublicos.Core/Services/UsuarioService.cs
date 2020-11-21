using dbServiciosPublicos;
using ServiciosPublicos.Core.Entities;
using ServiciosPublicos.Core.Repository;
using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Services
{
    public interface IUsuarioService
    {
        Usuario GetUsuario(int id);
        Usuario GetUsuario(string usr);
        Usuario GetUsuario(string usr, string password);
        List<Usuario> GetUsuarios();
        List<dynamic> GetUsuariosFiltro(string nombre = null);
        bool InsertUpdateUsuario(Usuario Usuario, out string Message);
        bool InsertarUsuario(Usuario Usuario, out string Message);
        bool EliminarUsuario(int id, out string Message);
    }

    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        //private readonly IAccesosTipoUsuarioRepository _accesosTipoUsuarioRepository;

        /*public UsuarioService(IUsuarioRepository usuarioRepository, IAccesosTipoUsuarioRepository accesosTipoUsuarioRepository) {
            _usuarioRepository = usuarioRepository;
            _accesosTipoUsuarioRepository = accesosTipoUsuarioRepository;
        }*/
        public UsuarioService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;            
        }

        public Usuario GetUsuario(int id) {
            return _usuarioRepository.Get(id);
        }

        public Usuario GetUsuario(string usr, string password)
        {
            return _usuarioRepository.GetUsuario(usr, password);
        }

        public Usuario GetUsuario(string usr)
        {
            return _usuarioRepository.GetUsuario(usr);
        }

        public List<Usuario> GetUsuarios() {
            return _usuarioRepository.GetAll("hiram74_residencias.Usuario").ToList();
        }

        public List<dynamic> GetUsuariosFiltro(string nombre = null)
        {
            string filter = " Where ";

            if (!string.IsNullOrEmpty(nombre))
            {
                filter += string.Format("usuario.Nombre_usuario like '%{0}%' or usuario.Login_usuario like '%{0}%' or usuario.ID_usuario like '%{0}%' or tipoUsuario.Descripcion_tipoUsuario like '%{0}%'", nombre);
            }

            Sql query = new Sql(@"select usuario.*, tipoUsuario.Descripcion_tipoUsuario as NombreTipo from  [hiram74_residencias].[Usuario] usuario
                                  inner join [hiram74_residencias].[Tipo_usuario] tipoUsuario on tipoUsuario.ID_tipoUsuario = usuario.ID_tipoUsuario" + (!string.IsNullOrEmpty(nombre) ? filter : ""));
            return _usuarioRepository.GetByDynamicFilter(query);
        }

        public bool InsertarUsuario(Usuario usuario, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                _usuarioRepository.Add<int>(usuario);

                Message = "Usuario registrado " + usuario.Login_usuario + "con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Usuario No pudo ser registrado Error: " + ex.Message;
            }

            return result;
        }

        public bool InsertUpdateUsuario(Usuario usuario, out string Message) {

            Message = string.Empty;
            bool result = false;
            try
            {
                _usuarioRepository.InsertOrUpdate<int>(usuario);

                Message = "Usuario guardado " + usuario.Login_usuario + "con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Usuario No pudo ser guardado Error: " + ex.Message;
            }

            return result;
        }

        public bool EliminarUsuario(int id, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                var usuario = _usuarioRepository.Get(id);

                _usuarioRepository.Remove(usuario);

                Message = "Usuario eliminado " + usuario.Login_usuario + "con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Usuario No pudo ser eliminado Error: " + ex.Message;
            }
            return result;
        }

        /*public List<AccesosTipoUsuario> GetPermisosUsuario(int id)
        {
            Sql query = new Sql()
                .Select("*").From("AccesosTipoUsuario")
                .Where("ID_TipoUsuario = @0", id);

            return _accesosTipoUsuarioRepository.GetByFilter(query);
        }*/
    }
}
