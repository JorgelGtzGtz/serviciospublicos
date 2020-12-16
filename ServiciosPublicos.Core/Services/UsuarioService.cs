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
        List<dynamic> GetUsuariosFiltro(string textoB, string estado, string tipoU, string repActivos);
        List<Usuario> GetUsuariosJefeCuadrilla();
        bool UpdateUsuario(Usuario Usuario, out string Message);
        bool InsertarUsuario(Usuario Usuario, out string Message);
        bool EliminarUsuario(int id, out string Message);
        int ObtenerIDRegistro(out string Message);
    }

    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ITipoUsuarioRepository _tipoUsuarioRepository;
        public UsuarioService(IUsuarioRepository usuarioRepository, ITipoUsuarioRepository tipoUsuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
            _tipoUsuarioRepository = tipoUsuarioRepository;
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

        public List<Usuario> GetUsuariosJefeCuadrilla()
        {
            var tipoUsuario = _tipoUsuarioRepository.GetTipo("Jefe de cuadrilla");
            return _usuarioRepository.GetUsuarioJefeDisponible(tipoUsuario.ID_tipoUsuario);

        }

        //Regresa una lista de los usuarios y también se muestra el tipo de usuario
        //Esta funcion es para busquedas dinamicas
        public List<dynamic> GetUsuariosFiltro(string textoB, string estado, string tipoU, string repActivos)
        {
            return _usuarioRepository.GetUsuariosFiltroDinamico(textoB, estado, tipoU, repActivos);
        }

        //Insertar nuevo usuario y regresa true o false
        //dependiendo si la operacion fue exitosa
        public bool InsertarUsuario(Usuario usuario, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                _usuarioRepository.Add<int>(usuario);

                Message = "Usuario " + usuario.Login_usuario + " registrado con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Usuario" + usuario.Login_usuario + "no pudo ser registrado Error: " + ex.Message;
            }
            return result;
        }

        //Actualizar usuario existente, recibe un usuario y regresa true o false
        //dependiendo si la operacion fue exitosa
        public bool UpdateUsuario(Usuario usuario, out string Message) {

            Message = string.Empty;
            bool result = false;
            try
            {
                //_usuarioRepository.InsertOrUpdate<int>(usuario, "ID_usuario");
                _usuarioRepository.Modify(usuario);

                Message = "Modificación de usuario " + usuario.Login_usuario + " exitosa";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Modificación de usuario" + usuario.Login_usuario + " fallida, Error: " + ex.Message;
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

                Message = "Usuario " + usuario.Login_usuario + " eliminado con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Usuario no pudo ser eliminado porque tiene registros asociados, Error: " + ex.Message;
            }
            return result;
        }

        public int ObtenerIDRegistro(out string Message)
        {
            Message = string.Empty;
            var result = 0;
            try
            {
                result = this._usuarioRepository.ObtenerUltimoID() + 1;
            }
            catch (Exception ex)
            {
                Message = "Error al obtener ID de registro actual. Error: " + ex.Message;
            }
            return result;
        }
    }
}
