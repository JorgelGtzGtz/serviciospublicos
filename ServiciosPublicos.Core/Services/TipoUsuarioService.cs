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
   public interface ITipoUsuarioService
    {
        Tipo_usuario GetTipoUsuario(int id);
        Tipo_usuario GetTipoUsuarioDescripcion(string descripcion);
        List<Tipo_usuario> GetTipoUsuariosGeneral();
        List<dynamic> GetTipoUsuariosFiltro(out string Message, string textoBusqueda = null, string estado= null);
        bool UpdateTipoUsuario(Tipo_usuario tipoUsuario, List<Procesos_Permiso> nuevosPermisos, out string Message);
        bool InsertTipoUsuario(Tipo_usuario tipoUsuario, List<Procesos_Permiso> permisosAsignados, out string Message);
        bool EliminarTipoUsuario(Tipo_usuario tipoUsuario, out string Message);
        int ObtenerIDRegistro(out string Message);
        List<Procesos_Permiso> GetPermisos();
        List<Permiso> GetPermisosTipoUsuario(int id, out string Message);
    }

    public class TipoUsuarioService : ITipoUsuarioService
    {
        
        private readonly ITipoUsuarioRepository _tipoUsuarioRepository;
        private readonly IPermisosRepository _permisosRepository;
        private readonly IProcesosPermisosRepository _procesosPermisosRepository;
        private readonly IUsuarioRepository _usuarioReporsitory;

        public TipoUsuarioService(ITipoUsuarioRepository tipoUsuarioRepository, 
            IPermisosRepository permisosTipoUsuarioRepository, 
            IProcesosPermisosRepository procesosPermisosRepository,
            IUsuarioRepository usuarioRepository)
        {
            _tipoUsuarioRepository = tipoUsuarioRepository;
            _permisosRepository = permisosTipoUsuarioRepository;
            _procesosPermisosRepository = procesosPermisosRepository;
            _usuarioReporsitory = usuarioRepository;
        }

        // Entrada: valor tipo int del ID del tipo de usuario.
        // Salida: tipo de usuario
        // Descripción: Método para obtener un tipo de usuario por ID
        public Tipo_usuario GetTipoUsuario(int id) {
            return _tipoUsuarioRepository.Get(id);
        }

        // Entrada: valor tipo string con la descripción del tipo de usuario.
        // Salida: tipo de usuario
        // Descripción: Método para obtener un tipo de usuario por su descripción.
        public Tipo_usuario GetTipoUsuarioDescripcion(string descripcion)
        {
            return _tipoUsuarioRepository.GetTipo(descripcion);
        }

        // Entrada: Ninguna
        // Salida: lista de tipos de usuario.
        // Descripción: REGRESA TODOS LOS TIPOS DE USUARIO SIN SUS PERMISOS
        public List<Tipo_usuario> GetTipoUsuariosGeneral() {
            return _tipoUsuarioRepository.GetTipoUsuarioGeneral();
        }

        // Entrada: valor string para ID o descripción de tipo de usuario y valor string de estado.
        // Salida: Lista de tipo dynamic con los tipos de usuario encontrados.
        // Descripción: Método para ejecutar un filtro dinámico para buscar tipos de usuario con varios 
        // criterios de búsqueda.
        public List<dynamic> GetTipoUsuariosFiltro(out string Message, string textoBusqueda = null, string estado = null)
        {
            Message = string.Empty;
            var result = new List<dynamic>();
            try
            {
                result = _tipoUsuarioRepository.GetTipoUsuariosFiltroDinamico(textoBusqueda, estado);
            }catch(Exception ex)
            {
                Message = "Error al hacer busqueda. Error "+ex.Message;

            }
            return result;
        }

        // Entrada: Variable para mensaje de tipo string.
        // Salida: valor int.
        // Descripción: Método para obtener el próximo ID de tipo de usuario.
        public int ObtenerIDRegistro(out string Message)
        {
            Message = string.Empty;
            var result = 0;
            try
            {
                result = this._tipoUsuarioRepository.ObtenerUltimoID() + 1;
            }catch (Exception ex)
            {
                Message = "Error al obtener ID de registro actual. Error: "+ ex.Message;
            }
            return result;
        }

        // Entrada: valor Tipo de Usuario y lista de tipo Procesos_permisos
        // Salida: valor boolean.
        // Descripción: Método para insertar nuevo tipo de usuario.
        //Recibe un modelo tipo de usuario, lo registra y obtiene el ID
        //Despues agrega cada permiso que le corresponde a ese tipo de usuario
        public bool InsertTipoUsuario(Tipo_usuario tipoUsuario, List<Procesos_Permiso> permisosAsignados, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                var id = _tipoUsuarioRepository.Add<int>(tipoUsuario);
                tipoUsuario.ID_tipoUsuario = id;

                //Insertar permisos asignados a este tipo de usuario.
                //Recorre los que se mandan en la petición y los inserta con el id obtenido
                // al crear el tipo de usuario
                foreach (var permiso in permisosAsignados)
                {
                    Permiso permisoTipoUsuario =  new Permiso();
                        permisoTipoUsuario.ID_procesoPermisos = permiso.ID_ProcesosPermiso;
                        permisoTipoUsuario.ID_tipoUsuario = id;

                        _permisosRepository.Add<int>(permisoTipoUsuario);
                }

                Message = "Tipo de Usuario " + tipoUsuario.Descripcion_tipoUsuario + " guardado con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Tipo de Usuario"+ tipoUsuario.Descripcion_tipoUsuario + " no pudo ser guardado Error: " + ex.Message;
            }
            return result;
        }

        // Entrada: valor Tipo de Usuario y lista de tipo Procesos_permisos
        // Salida: valor boolean.
        // Descripción: Método para actualizar el tipo de usuario, así también sus procesos permitidos.
        public bool UpdateTipoUsuario(Tipo_usuario tipoUsuario, List<Procesos_Permiso> nuevosPermisos, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                int id = tipoUsuario.ID_tipoUsuario;
                _tipoUsuarioRepository.Modify(tipoUsuario);
                List<Permiso> permisosActuales = _permisosRepository.GetPermisosTipoUsuario(tipoUsuario.ID_tipoUsuario);

                // Eliminar permisos que no existen en los actuales
                foreach (var permiso in permisosActuales.Where(p => !nuevosPermisos.Any(p2 => p2.ID_ProcesosPermiso == p.ID_procesoPermisos)))
                {
                    _permisosRepository.Remove(permiso);
                }

                //Insertar o Actualizar permisos existentes o nuevos.
                //Con un for each recorre los permisos que se quieren agregar y checa con un query
                // si ya existen en el tipo de usuario, si se regresa un null, los agrega.
                foreach (var permiso in nuevosPermisos)
                {
                    Permiso permisoTipoUsuario = _permisosRepository.GetPermisoTipoUsuario(id, permiso.ID_ProcesosPermiso);
                    if (permisoTipoUsuario == null)
                    {
                        permisoTipoUsuario = new Permiso();
                        permisoTipoUsuario.ID_procesoPermisos = permiso.ID_ProcesosPermiso;
                        permisoTipoUsuario.ID_tipoUsuario = id;

                        _permisosRepository.Add<int>(permisoTipoUsuario);
                    }                    
                }
                Message = "Tipo de Usuario " + tipoUsuario.Descripcion_tipoUsuario + " guardado con exito";
                result = true;
            }
            catch (Exception ex)
            {
                Message = "Tipo Usuario" + tipoUsuario.Descripcion_tipoUsuario + " no pudo ser guardado Error: " + ex.Message;
            }
            return result;
        }

        // Entrada: valor tipo int del ID del tipo de usuario
        // Salida: valor boolean.
        // Descripción: Elimina tipo de usuario al modificar su valor Diponible a falso.
        // Esto se realiza solo si no tiene registros relacionados.
        public bool EliminarTipoUsuario(Tipo_usuario tipoUsuario, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                //VERIFICAR QUE NO EXISTAN REGISTROS CON ESTE TIPO DE USUARIO
                List<Usuario> usuario = _usuarioReporsitory.GetUsuariosPorTipo(tipoUsuario.ID_tipoUsuario);
                if (usuario.Count == 0)
                {
                    tipoUsuario.Disponible = false;
                    _tipoUsuarioRepository.Modify(tipoUsuario);
                    Message = "Tipo Usuario  " + tipoUsuario.Descripcion_tipoUsuario + " eliminado con exito";
                    result = true;
                }
                else
                {
                    Message = "Tipo Usuario  " + tipoUsuario.Descripcion_tipoUsuario + " no puede ser eliminado porque " +
                                "tiene registros relacionados";
                }  
            }
            catch (Exception ex)
            {
                Message = "Tipo de Usuario No pudo ser eliminado Error: " + ex.Message;
            }
            return result;
        }
       

        //DEVUELVE TODOS LOS PERMISOS EXISTENTES SOLO LOS ID'S
        public List<Procesos_Permiso> GetPermisos()
        {
            return _procesosPermisosRepository.GetProcesosPermisos();
        }

        // Entrada: valor tipo int del ID del tipo de usuario
        // Salida: lista de tipo Permiso.
        // Descripción: Devuelve todos los permisos que el tipo de usuario tiene asignado.
        public List<Permiso> GetPermisosTipoUsuario(int id, out string Message)
        {
            Message = string.Empty;
            List<Permiso> permisos = null;
            try
            {
                permisos = _permisosRepository.GetPermisosTipoUsuario(id);
                Message = "Procesos del tipo de usuario recuperados correctamente";
            }
            catch(Exception ex)
            {
                Message = "Procesos del tipo de usuario no pudieron ser recuperado"+ ex.Message;
            }
            return permisos;
        }
        
        
    }
}
