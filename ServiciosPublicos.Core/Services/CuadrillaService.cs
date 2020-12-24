using dbServiciosPublicos;
using PetaPoco;
using ServiciosPublicos.Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Services
{
    public interface ICuadrillaService
    {
        bool InsertarCuadrilla(Cuadrilla cuadrilla, out string Message);
        bool ActualizarCuadrilla(Cuadrilla cuadrilla, out string Message);
        bool EliminarCuadrilla(int id, out string Message);
        int ObtenerIDRegistro();
        Cuadrilla GetCuadrilla(int id);
        List<Cuadrilla> GetCuadrillaList();
        List<dynamic> GetCuadrillasConJefe();
        List<dynamic> FiltroCuadrillas(string textoB, string estado);
        void ModificarUsuarioJefe(int idUsuario, bool asignacion);
    }
    public class CuadrillaService: ICuadrillaService
    {
        private readonly ICuadrillaRepository _cuadrillaRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly IReporteRepository _reporteRepository;
        private readonly IUsuarioRepository _usuarioRepository;

        public CuadrillaService(ICuadrillaRepository cuadrillaRepository, ITicketRepository ticketRepository, 
                                IReporteRepository reporteRepository, IUsuarioRepository usuarioRepository )
        {
            _cuadrillaRepository = cuadrillaRepository;
            _ticketRepository = ticketRepository;
            _reporteRepository = reporteRepository;
            _usuarioRepository = usuarioRepository;
        }

        //Obtener cuadrilla buscando por ID
        public Cuadrilla GetCuadrilla(int id)
        {
            var valor = _cuadrillaRepository.GetCuadrilla(id);
            return valor;
        }

        // obtener lista de cuadrillas general
        public List<Cuadrilla> GetCuadrillaList()
        {
            return _cuadrillaRepository.GetAll("Cuadrilla").ToList();
        }


        //Obtener lista de cuadrillas con el nombre del jefe de cuadrilla
        public List<dynamic> GetCuadrillasConJefe()
        {
            return _cuadrillaRepository.GetCuadrillasConJefeQuery();
        }

        public List<dynamic> FiltroCuadrillas(string textoB, string estado)
        {
            return _cuadrillaRepository.FiltroDinamicoCuadrillas(textoB, estado);
        }

        public int ObtenerIDRegistro()
        {
            return _cuadrillaRepository.ObtenerUltimoID() + 1;
        }

        //Insertar cuadrilla, recibe un objeto cuadrilla y devuelve un valor booleando
        // que informa si la operacion fue exitosa o no
        public bool InsertarCuadrilla(Cuadrilla cuadrilla, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            int idUsuario = cuadrilla.ID_JefeCuadrilla;
                    
            
            try
            {
                _cuadrillaRepository.Add<int>(cuadrilla);
                ModificarUsuarioJefe(idUsuario, true);
                Message = "Cuadrilla " + cuadrilla.Nombre_cuadrilla + " registrada con exito";
                result = true;
            }
            catch (Exception ex)
            {
                Message = "No se puede realizar el registro de cuadrilla "+cuadrilla.Nombre_cuadrilla +" "+ex.Message;
            }
            return result;
        }

        // Modificar el campo "Jefe asignado" en Usuario
        public void ModificarUsuarioJefe(int idUsuario, bool asignacion)
        {
            var usuarioJefe = _usuarioRepository.Get(idUsuario);
            usuarioJefe.Jefe_asignado = asignacion;
            _usuarioRepository.Modify(usuarioJefe);
        }

        //Actualizar cuadrilla, recibe un objeto cuadrilla
        public bool ActualizarCuadrilla(Cuadrilla cuadrilla, out string Message)
        {
            Message = string.Empty;
            bool result = false;

            // Obtener datos de la base de datos, de la cuadrilla a modificar
            var cuadrillaActual = _cuadrillaRepository.GetCuadrilla(cuadrilla.ID_cuadrilla);
            // Obtener el jefe registrado en BD y el jefe que viene con la cuadrilla a modificar
            int jefeActual = cuadrillaActual.ID_JefeCuadrilla;
            int jefeNuevo = cuadrilla.ID_JefeCuadrilla;            

            try
            {
                _cuadrillaRepository.Modify(cuadrilla);
                // Verificar si se el jefe asignado es el mismo o si cambio, y modificar campo jefeAsignado de usuario
                if (jefeActual != jefeNuevo)
                {
                    ModificarUsuarioJefe(jefeActual, false);
                    ModificarUsuarioJefe(jefeNuevo, true);
                }
                Message = "Cambios en cuadrilla " + cuadrilla.Nombre_cuadrilla + " se guardaron con exito";
                result = true;
            }
            catch(Exception ex)
            {
                Message = "No se pueden guardar los cambios en cuadrilla " + cuadrilla.Nombre_cuadrilla + ", "+ex.Message;
            }
            return result;
        }

        //Elimina una cuadrilla, recibe un ID de cuadrilla y regresa un booleando 
        //para indicar si la operacion fue exitosa o no
        public bool EliminarCuadrilla(int id, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                Cuadrilla cuadrilla = _cuadrillaRepository.Get<int>(id); 
                ModificarUsuarioJefe(cuadrilla.ID_JefeCuadrilla, false);
                cuadrilla.Disponible = false;
                _cuadrillaRepository.Modify(cuadrilla);
                Message = "Cuadrilla  " + cuadrilla.Nombre_cuadrilla + " eliminado con exito";
                result = true;
            }
            catch (Exception ex)
            {
                Message = "Cuadrilla no pudo ser eliminada Error: " + ex.Message;
            }
            return result;
        }
    }
}
