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
        Usuario GetUsuarioEmail(string email);
        Usuario GetUsuarioTel(string telefono);
        Usuario GetUsuario(string usr, string password);
        List<Usuario> GetUsuarios();
        List<dynamic> GetUsuariosFiltro(string textoB, string estado, string tipoU, string repActivos);
        List<Usuario> GetUsuariosJefeCuadrilla();
        bool UpdateUsuario(Usuario Usuario, out string Message);
        bool InsertarUsuario(Usuario Usuario, out string Message);
        bool EliminarUsuario(Usuario usuario, out string Message);
        int ObtenerIDRegistro(out string Message);
        string SendMail(Usuario user, out string Message, int code);
        List<string> forgotPassword(string email, out string Message);
        void modificarPassword(string idUsuario, string password, out string Message);
        bool verificarToken(string token, string tokenA, string fecha, string email);
        bool verificarCaducidadToken(DateTime fechaCreacion);
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

        // Entrada: ID de usuario de tipo INT
        // Salida: Objeto de tipo Usuario.
        // Descripción: Llama al método del repositorio para buscar un Usuario por ID.
        public Usuario GetUsuario(int id) {
            return _usuarioRepository.Get(id);
        }

        // Entrada: string con usuario y string con contraseña de usuario.
        // Salida: Objeto de tipo Usuario.
        // Descripción: Llama al método del reporsitorio que busca el Usuario por usuario y contraseña.
        public Usuario GetUsuario(string usr, string password)
        {
            return _usuarioRepository.GetUsuario(usr, password);
        }

        // Entrada: valor string para usuario.
        // Salida: objeto de tipo Usuario.
        // Descripción: Llama al método del repositorio de Usuario para obtener un Usuario
        // por su valor de Login_usuario.
        public Usuario GetUsuario(string usr)
        {
            return _usuarioRepository.GetUsuario(usr);
        }

        public Usuario GetUsuarioEmail(string email)
        {
            return _usuarioRepository.GetUsuarioByEmail(email);
        }

        public Usuario GetUsuarioTel(string telefono)
        {
            return _usuarioRepository.GetUsuarioByPhone(telefono);
        }

        // Entrada: Ninguna.
        // Salida: Lista de tipo Usuario.
        // Descripción: Obtiene todos los usuarios existentes en la base de datos.
        public List<Usuario> GetUsuarios() {
            return _usuarioRepository.GetAll("hiram74_residencias.Usuario").ToList();
        }

        // Entrada: Ninguna.
        // Salida:lista de tipo Usuario.
        // Descripción: Llama al método del reporsitorio de Usuario para buscar los usuarios cuyo
        // tipo de usuario sea "Jefe de cuadrilla"
        public List<Usuario> GetUsuariosJefeCuadrilla()
        {
            var tipoUsuario = _tipoUsuarioRepository.GetTipo("Jefe de cuadrilla");
            return _usuarioRepository.GetUsuarioJefeDisponible(tipoUsuario.ID_tipoUsuario);

        }

        // Entrada: string para texto de búsqueda, string para estado de usuario, string para tipo de usuario y 
        //          string para reportes activos.
        // Salida: lista de tipo Dynamic con los registros de usuario.
        // Descripción: Regresa una lista de los usuarios con su tipo de usuario de los registros que cumplieron con los filtros.
        //Esta funcion es para busquedas dinamicas
        public List<dynamic> GetUsuariosFiltro(string textoB, string estado, string tipoU, string repActivos)
        {
            return _usuarioRepository.GetUsuariosFiltroDinamico(textoB, estado, tipoU, repActivos);
        }

        // Entrada: Objeto de tipo Usuario y mensaje de tipo string.
        // Salida: valor de tipo booleano.
        // Descripción: Insertar nuevo usuario en la base de datos mediante el método Add del repositorio y regresa true o false
        // dependiendo si la operacion fue exitosa
        public bool InsertarUsuario(Usuario usuario, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                usuario.Disponible = true;
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

        // Entrada: Objeto de tipo Usuario y mensaje de tipo string.
        // Salida: valor booleano.
        // Descripción: Actualizar usuario existente mediante método "Modify" de repositorio, recibe un usuario y regresa true o false
        // dependiendo si la operacion fue exitosa
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

        // Entrada: objeto de tipo Usuario y mensaje de tipo string.
        // Salida: valor booleano.
        // Descripción: Modifica el atributo "Disponible" del objeto Usuario mediante el método "Modify" del repositorio 
        // para luego actualizar su registro en la base de datos, efectuando así la eliminación lógica.
        public bool EliminarUsuario(Usuario usuario, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                usuario.Disponible = false;

                _usuarioRepository.Modify(usuario);

                Message = "Usuario " + usuario.Login_usuario + " eliminado con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Usuario no pudo ser eliminado. Error: " + ex.Message;
            }
            return result;
        }

        // Entrada: Mensaje de tipo string.
        // Salida: ID nuevo de tipo int.
        // Descripción: Obtiene el ID del último registro en la tabla Usuario y le suma
        // 1 para obtener el ID próximo del nuevo registro.
        public int ObtenerIDRegistro(out string Message)
        {
            Message = string.Empty;
            var result = 0;
            try
            {
                result = this._usuarioRepository.GetUltimoID() + 1;
            }
            catch (Exception ex)
            {
                Message = "Error al obtener ID de registro actual. Error: " + ex.Message;
            }
            return result;
        }

        //G: LLAMA DIRECTO AL METODO DE ENVIAR CORREO ENVIANDO CODIGO DE CONFIRMACION Y MENSAJE POR PARAMETROS
        //Método de recuperación de contraseña para app móvil
        public string SendMail(Usuario user, out string Message, int code)
        {
            Message = _usuarioRepository.EnviarCorreo(user.Correo_usuario, "Confirma tu correo", "Tu código de verificación es: "+code);
            return Message;
        }

        //Entrada: string correo de usuario, string con código de usuario.
        //Salida: Mensaje tipo string.
        //Descripción:Método para recuperación de contraseña web.
        public string sendMailRecuperacion(string correo, string token)
        {
            string message = _usuarioRepository.EnviarCorreoRecuperacion(correo, "Recuperación de contraseña", token);
            return message;
        }

        // Entrada: string con email.
        // Salida: token tipo string para cambiar la contraseña.
        // Descripción: Genera correo para recuperacion de contraseña por sistema web.
        public List<string> forgotPassword(string email, out string Message)
        {
            Message = string.Empty;
            Usuario usuario = null;
            List<string> token = new List<string>();

            //buscar usuario 
            try
            {
                usuario = this.GetUsuarioEmail(email);
                if (usuario != null)
                {
                    // Generar número random
                    string numeroRandom = string.Empty;
                    var random = new Random();
                    for (int i = 0; i < 4; i++)
                    {
                        numeroRandom += random.Next(0, 9).ToString();
                    }

                    // encriptar fecha
                    byte[] encriptarF = BitConverter.GetBytes(DateTime.UtcNow.ToBinary());
                    string fechaEncriptada = Convert.ToBase64String(encriptarF);

                    // encriptar correo
                    // byte[] encriptar = System.Text.Encoding.Unicode.GetBytes(usuario.Correo_usuario);
                    // string correoEncriptado = Convert.ToBase64String(encriptar);

                    // Armar token
                    token.Add(numeroRandom);
                    token.Add(fechaEncriptada);
                    token.Add(usuario.ID_usuario.ToString());
                    Message = sendMailRecuperacion(usuario.Correo_usuario, token[0]);
                }
            }
            catch(Exception ex)
            {
                Message = ex.Message;
            }            
            
            return token;
        }

        // Entrada: string para idUsuario, string para password.
        // Salida: valor bool
        // Descripción: cambia la contraseña del usuario.
        public void modificarPassword(string idUsuario, string password, out string Message)
        {
            int id_usuario = Int32.Parse(idUsuario);
            // byte[] decodificarCorreo = Convert.FromBase64String(componentesToken[2]);
            // string correoUsuario = System.Text.Encoding.Unicode.GetString(decodificarCorreo);

            try
                {
                    _usuarioRepository.CambiarPassword(id_usuario, password);
                    Message = "La contraseña se ha cambiado exitosamente.";
                }
                catch (Exception ex)
                {
                    Message = "No ha sido posible cambiar la contraseña. Error:" + ex.Message;
                }
                
            
        }

        // Entrada: string para token, string para tokenAsignado, string para fecha encriptada, string con email.
        // Salida: bool.
        // Descripción: Verifica que el token ingresado por el usuario sea el que se le asignó, además verifica que el token 
        // no tenga más de una hora de antiguedad.
        public bool verificarToken( string token,string tokenA, string fecha, string email)
        {
            bool cambiarPassword;
            // Descifrar fecha de creación token
            byte[] data = Convert.FromBase64String(fecha);
            DateTime fechaCreacion = DateTime.FromBinary(BitConverter.ToInt64(data, 0));

            // Verificar que el token ingresado y el otorgado sea el mismo.
            bool mismaClave = token.Equals(tokenA) ? true : false;


            // Verificar que es el mismo usuario que lo solicitó
            // int id_usuarioToken = Int32.Parse(componentesToken[2]);
            // Usuario usuario = _usuarioRepository.Get<int>(id_usuarioToken);            
            // bool mismoUsuario = usuario.Correo_usuario == email ? true : false;

            // Verificar que aún está vigente.
            bool fechaValida = verificarCaducidadToken(fechaCreacion);

            // Verificar que cumpla con las dos condiciones
            if (mismaClave && fechaValida)
            {
                cambiarPassword = true;
            }
            else
            {
                cambiarPassword = false;
            }           

            return cambiarPassword;
        }

        // Entrada: fecha de tipo DateTime
        // Salida: Valor bool 
        // Descripción: verifica que la fecha de creación del token no tenga más de una hora de creación.
        public bool verificarCaducidadToken(DateTime fechaCreacion)
        {
            bool fechaValida;
            if (fechaCreacion < DateTime.UtcNow.AddHours(-1))
            {
                // old token
                fechaValida = false;
            }
            else
            {
                fechaValida = true;
            }
            return fechaValida;

        }

    }
}
