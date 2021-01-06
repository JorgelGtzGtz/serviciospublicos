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
        List<Permiso> GetPermisos(int tipoU);
        bool InsertarPermiso(Permiso permiso, out string Message);

    }
    public class PermisosService : IPermisosService
    {
        private readonly IPermisosRepository _permisosRepository;
        public PermisosService(IPermisosRepository permisosReporsitory)
        {
            _permisosRepository = permisosReporsitory;

        }

        // Entrada: ID tipo de Usuario de tipo INT
        // Salida: Lista de tipo permiso.
        // Descripción: Llama al método del repositorio para obtener 
        // la lista de permisos que se relacionan con un tipo de usuario.
        public List<Permiso> GetPermisos(int idTipo)
        {
           return  _permisosRepository.GetPermisosTipoUsuario(idTipo);

        }

        // Entrada: objeto de tipo Permiso y valor string de mensaje
        // Salida: valor booleano.
        // Descripción: Llama al método del repositorio que inserta un permiso en la base de datos.
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


    }
}
