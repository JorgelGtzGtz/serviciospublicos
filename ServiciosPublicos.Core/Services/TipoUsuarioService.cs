using dbconnection;
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
        TiposUsuario GetTipoUsuario(int id);
        List<TiposUsuario> GetTipoUsuarios();
        List<TiposUsuario> GetTipoUsuariosFiltro(string nombre = null);
        bool InsertUpdateTipoUsuario(TiposUsuario tipoPersonal, List<Acceso> accesos, out string Message);
        bool EliminarTipoUsuario(int id, out string Message);
        List<Acceso> GetTipoUsuarioAccesos(int id);
        List<Acceso> GetAccesos();
    }

    public class TipoUsuarioService : ITipoUsuarioService
    {
        private readonly ITipoUsuarioRepository _tipoUsuarioRepository;
        private readonly IAccesosTipoUsuarioRepository _accesosTipoUsuarioRepository;
        private readonly IAccesosRepository _accesosRepository;

        public TipoUsuarioService(ITipoUsuarioRepository tipoUsuarioRepository, IAccesosTipoUsuarioRepository accesosTipoUsuarioRepository, IAccesosRepository accesosRepository) {
            _tipoUsuarioRepository = tipoUsuarioRepository;
            _accesosTipoUsuarioRepository = accesosTipoUsuarioRepository;
            _accesosRepository = accesosRepository;
        }

        public TiposUsuario GetTipoUsuario(int id) {
            return _tipoUsuarioRepository.Get(id);
        }

        public List<TiposUsuario> GetTipoUsuarios() {
            return _tipoUsuarioRepository.GetAll("TiposUsuario").ToList();
        }

        public List<TiposUsuario> GetTipoUsuariosFiltro(string nombre = null)
        {
            string filter = " Where ";

            if (!string.IsNullOrEmpty(nombre))
            {
                filter += string.Format("Nombre = '{0}' ", nombre);
            }

            Sql query = new Sql(@"select * from TiposUsuario " + (!string.IsNullOrEmpty(nombre) ? filter : ""));
            return _tipoUsuarioRepository.GetByFilter(query);
        }

        public bool InsertUpdateTipoUsuario(TiposUsuario tipoPersonal, List<Acceso> accesos, out string Message)
        {

            Message = string.Empty;
            bool result = false;
            try
            {
                var id = _tipoUsuarioRepository.InsertOrUpdate<int>(tipoPersonal);
                tipoPersonal.ID = id;
                Sql query = new Sql()
                .Select("*").From("AccesosTipoUsuario")
                .Where("ID_TipoUsuario = @0", id);
                List<AccesosTipoUsuario> _detallesActuales = _accesosTipoUsuarioRepository.GetByFilter(query);

                // Eliminar detalles que no existen en los actuales
                foreach (var detalleNoExiste in _detallesActuales.Where(p => !accesos.Any(p2 => p2.ID == p.ID_Acceso)))
                {
                    _accesosTipoUsuarioRepository.Remove(detalleNoExiste);
                }

                //Insertar o Actualizar detalles existentes o nuevos
                foreach (var detalle in accesos)
                {
                    query = new Sql()
                    .Select("*").From("AccesosTipoUsuario")
                    .Where("ID_TipoUsuario = @0 and ID_Acceso = @1", id, detalle.ID);
                    AccesosTipoUsuario accesosPersonal = _accesosTipoUsuarioRepository.Get(query);
                    if (accesosPersonal == null)
                    {
                        accesosPersonal = new AccesosTipoUsuario();
                        accesosPersonal.ID_Acceso = detalle.ID;
                        accesosPersonal.ID_TipoUsuario = id;
                    }
                    _accesosTipoUsuarioRepository.InsertOrUpdate<int>(accesosPersonal);
                }

                Message = "Tipo de Usuario guardado " + tipoPersonal.Nombre + "con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "TipoUsuario No pudo ser guardado Error: " + ex.Message;
            }

            return result;
        }

        public bool EliminarTipoUsuario(int id, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                var tipo = _tipoUsuarioRepository.Get(id);
                Sql query = new Sql()
                .Select("*").From("AccesosTipoUsuario")
                .Where("ID_TipoUsuario = @0", tipo.ID);
                var listAccesos = _accesosTipoUsuarioRepository.GetByFilter(query);

                foreach (var item in listAccesos)
                {
                    _accesosTipoUsuarioRepository.Remove(item);
                }

                _tipoUsuarioRepository.Remove(tipo);

                Message = "Tipo Usuario eliminado " + tipo.Nombre + "con exito";
                result = true;
            }
            catch (Exception ex)
            {

                Message = "Usuario No pudo ser eliminado Error: " + ex.Message;
            }
            return result;
        }

        public List<Acceso> GetTipoUsuarioAccesos(int id)
        {
            Sql query = new Sql(@"select a.* from [dbo].[Accesos] a
                                inner join [dbo].[AccesosTipoUsuario] ap on ap.ID_Acceso = a.ID
                                Where ap.ID_TipoUsuario = @0", id);
            List<Acceso> accesos = _accesosRepository.GetByFilter(query);

            return accesos;
        }

        public List<Acceso> GetAccesos()
        {
            return _accesosRepository.GetAll("Accesos").ToList();
        }
    }
}
