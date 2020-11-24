using dbServiciosPublicos;
using ServiciosPublicos.Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Services
{
    public interface IPermisosService
    {
        List<dynamic> GetPermisos(string tipoUsuario);
        bool InsertarPermiso(Permiso permiso, out string Message);
        bool ActualizarPermiso(Permiso permiso, out string Message);
        bool EliminarPermiso(int id, out string Message);

    }
    public class PermisosService : IPermisosService
    {
        private readonly IPermisosRepository _permisosRepository;
        public PermisosService(IPermisosRepository permisosReporsitory)
        {
            _permisosRepository = permisosReporsitory;

        }

        public List<dynamic> GetPermisos(string tipoUsuario = null)
        {
           return  _permisosRepository.GetPermisosTipoUsuario(tipoUsuario);

        }

        public bool InsertarPermiso(Permiso permiso, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                _permisosRepository.Add<int>(permiso);

                Message = "Permiso agregado con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Permiso no pude ser agregado Error: " + ex.Message;
            }

            return result;
        }

        public bool ActualizarPermiso(Permiso permiso, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                _permisosRepository.InsertOrUpdate<int>(permiso, "ID_permiso");
                Message = "Permiso actualizado con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Permiso no pudo ser guardado Error: " + ex.Message;
            }

            return result;
        }


        public bool EliminarPermiso(int id, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                var permiso = _permisosRepository.Get(id);

                _permisosRepository.Remove(permiso);

                Message = "Permiso eliminado con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Permiso no pudo ser eliminado Error: " + ex.Message;
            }
            return result;
        }

    }
}
