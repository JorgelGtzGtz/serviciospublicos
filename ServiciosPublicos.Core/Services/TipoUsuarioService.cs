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
        List<Tipo_usuario> GetTipoUsuarios();
        List<Tipo_usuario> GetTipoUsuariosFiltro(string nombre = null);
        bool UpdateTipoUsuario(Tipo_usuario tipoUsuario, List<Procesos_Permiso> nuevosPermisos, out string Message);
        bool InsertTipoUsuario(Tipo_usuario tipoUsuario, List<Procesos_Permiso> permisosAsignados, out string Message);
        bool EliminarTipoUsuario(int id, out string Message);
        List<Procesos_Permiso> GetPermisos();
        List<dynamic> GetPermisosTipoUsuario(int id, out string Message);
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

        public Tipo_usuario GetTipoUsuario(int id) {
            return _tipoUsuarioRepository.Get(id);
        }

        //REGRESA TODOS LOS TIPOS DE USUARIO SIN SUS PERMISOS
        public List<Tipo_usuario> GetTipoUsuarios() {
            return _tipoUsuarioRepository.GetAll("Tipo_usuario").ToList();
        }

        //FILTRO DINAMICO PARA BUSCAR TIPOS DE USUARIO CON VARIOS CRITERIOS DE BUSQUEDA
        public List<Tipo_usuario> GetTipoUsuariosFiltro(string nombre = null)
        {
            string filter = " Where ";

            if (!string.IsNullOrEmpty(nombre))
            {
                filter += string.Format("Descripcion_tipoUsuario = '{0}' ", nombre);
            }
            Sql query = new Sql(@"select * from Tipo_usuario " + (!string.IsNullOrEmpty(nombre) ? filter : ""));
            return _tipoUsuarioRepository.GetByFilter(query);
        }

        //Insertar nuevo tipo de usuario.
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

        // ESTE SE LLAMA EN LA ACTUALIZACION DE NUEVOS TIPOS DE USUARIO
        // ADEMAS DE CREAR O ACTUALIZAR EL TIPO DE USUARIO, TAMBIEN ACTUALIZA O AGREGA SUS PERMISOS
        public bool UpdateTipoUsuario(Tipo_usuario tipoUsuario, List<Procesos_Permiso> nuevosPermisos, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                var id = tipoUsuario.ID_tipoUsuario;
                _tipoUsuarioRepository.Modify(tipoUsuario);                
                Sql query = new Sql()
                .Select("*").From("Permisos")
                .Where("ID_tipoUsuario = @0", id);
                List<Permiso> permisosActuales = _permisosRepository.GetByFilter(query);

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
                    query = new Sql()
                    .Select("*").From("Permisos")
                    .Where("ID_tipoUsuario = @0 and ID_procesoPermisos = @1", id, permiso.ID_ProcesosPermiso);
                    Permiso permisoTipoUsuario = _permisosRepository.Get(query);
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
        
        //ELIMINA EL TIPO DE USUARIO
        //PRIMERO VERIFICA QUE NO EXISTA ALGUN USUARIO CON ESTE TIPO DE USUARIO
        //ELIMINA SUS PERMISOS Y LUEGO EL TIPO DE USUARIO
        public bool EliminarTipoUsuario(int id, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                //Obtener permisos del tipo de usuario
                var tipoUsuario = _tipoUsuarioRepository.Get(id);
                Sql query = new Sql()
                .Select("*").From("Permisos")
                .Where("ID_tipoUsuario = @0", tipoUsuario.ID_tipoUsuario);
                var listaPermisos = _permisosRepository.GetByFilter(query);

                //VERIFICAR QUE NO EXISTAN REGISTROS CON ESTE TIPO DE USUARIO
                Sql query2 = new Sql()
                .Select("*").From("Usuario")
                .Where("ID_tipoUsuario = @0", tipoUsuario.ID_tipoUsuario);
                List<Usuario> usuario = _usuarioReporsitory.GetByFilter(query2);
                if (usuario.Count == 0)
                {
                    foreach (var permiso in listaPermisos)
                    {
                        _permisosRepository.Remove(permiso);
                    }

                    _tipoUsuarioRepository.Remove(tipoUsuario);
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
                Message = "Usuario No pudo ser eliminado Error: " + ex.Message;
            }
            return result;
        }
       

        //DEVUELVE TODOS LOS PERMISOS EXISTENTES SOLO LOS ID'S
        public List<Procesos_Permiso> GetPermisos()
        {
            return _procesosPermisosRepository.GetProcesosPermisos();
        }

        //DEVUELVE LOS PERMISOS QUE EL TIPO DE USUARIO TIENE ASIGNADO
        public List<dynamic> GetPermisosTipoUsuario(int id, out string Message)
        {
            Message = string.Empty;
            List<dynamic> permisos = null;
            try
            {
                permisos = _permisosRepository.GetPermisosTipoUsuario(id.ToString());
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
