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
        bool EliminarCuadrilla(Cuadrilla cuadrilla, out string Message);
        int ObtenerIDRegistro();
        Cuadrilla GetCuadrilla(int id);
        Cuadrilla GetCuadrillaPorNombre(string nombre);
        List<Cuadrilla> GetCuadrillaList();
        List<dynamic> GetCuadrillasConJefe();
        List<dynamic> FiltroCuadrillas(string textoB, string estado);
        int? cambioJefes(Cuadrilla cuadrillaBD, Cuadrilla cuadrilla);
        void ModificarUsuarioJefe(int? idUsuario, bool asignacion);
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

        // Entrada: ID de cuadrilla de tipo INT
        // Salida: Objeto de tipo Cuadrilla.
        // Descripción: Llama al método del repositorio de cuadrilla para buscar una cuadrilla por ID.
        public Cuadrilla GetCuadrilla(int id)
        {
            var valor = _cuadrillaRepository.GetCuadrilla(id);
            return valor;
        }

        // Entrada: nombre de cuadrilla de tipo string
        // Salida: Objeto de tipo Cuadrilla.
        // Descripción: Llama al método del repositorio de cuadrilla para buscar una cuadrilla por nombre.
        public Cuadrilla GetCuadrillaPorNombre(string nombre)
        {
            var cuadrilla = _cuadrillaRepository.GetCuadrillaPorNombre(nombre);
            return cuadrilla;
        }

        // Entrada: Ninguna
        // Salida: Lista de tipo Cuadrilla.
        // Descripción: obtener lista de cuadrillas general
        public List<Cuadrilla> GetCuadrillaList()
        {
            return _cuadrillaRepository.GetCuadrillasLista();
        }

        // Entrada: Ninguna.
        // Salida: lista de tipo dynamic de los registros de cuadrilla y sus jefes de cuadrilla.
        // Descripción: Obtener lista de cuadrillas con el nombre del jefe de cuadrilla
        public List<dynamic> GetCuadrillasConJefe()
        {
            return _cuadrillaRepository.GetCuadrillasConJefeQuery();
        }

        // Entrada: valor string para texto de búsqueda y valor string para estado de cuadrilla.
        // Salida: lista de tipo dynamic con los registros de cuadrillas y sus jefes de cuadrilla, respectivamente.
        // Descripción: Llama al método de repositorio de Cuadrilla para efectuar una búsqueda dinámica de cuadrillas.
        public List<dynamic> FiltroCuadrillas(string textoB, string estado)
        {
            return _cuadrillaRepository.FiltroDinamicoCuadrillas(textoB, estado);
        }

        // Entrada: Ninguna.
        // Salida: valor INT.
        // Descripción: Llama al método de repositorio Cuadrilla para obtener el ID del último registro y le suma 1
        // para obtener el próximo ID.
        public int ObtenerIDRegistro()
        {
            return _cuadrillaRepository.ObtenerUltimoID() + 1;
        }

        // Entrada: Objeto de tipo Cuadrilla y mensaje de tipo string.
        // Salida: valor booleano.
        // Descripción: Insertar cuadrilla mediante método "Add" de repositorio y actualiza usuario para indicar
        // que fué asignado a una cuadrilla.
        //Devuelve un valor booleando que informa si la operacion fue exitosa o no
        public bool InsertarCuadrilla(Cuadrilla cuadrilla, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            int? idUsuario = cuadrilla.ID_JefeCuadrilla;
                    
            
            try
            {
                _cuadrillaRepository.Add<int>(cuadrilla);
                ModificarUsuarioJefe(idUsuario, true);
                Message = "¡Cuadrilla " + cuadrilla.Nombre_cuadrilla + " registrada con éxito!";
                result = true;
            }
            catch (Exception ex)
            {
                Message = "No se puede realizar el registro de cuadrilla "+cuadrilla.Nombre_cuadrilla +" "+ex.Message;
            }
            return result;
        }

        // Entrada: objeto Cuadrilla y mensaje de tipo string.
        // Salida: valor booleano.
        // Descripción: Actualiza cuadrilla con los datos del objeto Cuadrilla proporcionado.
        // Verifica que el usuario asignado como jefe de cuadrilla haya cambiado y de ser así realiza las 
        // modificaciones necesarias.
        public bool ActualizarCuadrilla(Cuadrilla cuadrillaModificada, out string Message)
        {
            Message = string.Empty;
            bool result = false;

            // Obtener datos de la base de datos de la cuadrilla a modificar
            var cuadrillaBD = _cuadrillaRepository.GetCuadrilla(cuadrillaModificada.ID_cuadrilla);

            // Verificar si se cambió de jefe
            int? jefeAsignado = cambioJefes(cuadrillaBD, cuadrillaModificada);
            cuadrillaModificada.ID_JefeCuadrilla = jefeAsignado;

            try
            {
                _cuadrillaRepository.Modify(cuadrillaModificada);
                Message = "¡Cuadrilla " + cuadrillaModificada.Nombre_cuadrilla + " actualizada con éxito!";
                result = true;
            }
            catch(Exception ex)
            {
                Message = "No se pueden guardar los cambios en cuadrilla " + cuadrillaModificada.Nombre_cuadrilla + ", "+ex.Message;
            }
            return result;
        }

        // Entrada: ID de usuario de tipo INT y valor bool que indica asignación o no.
        // Salida: Vacío.
        // Descripción: Modificar el campo "Jefe asignado" en Usuario
        public void ModificarUsuarioJefe(int? idUsuario, bool asignacion)
        {
            if (idUsuario != null)
            {
                Usuario usuarioJefe = _usuarioRepository.Get(idUsuario);
                usuarioJefe.Jefe_asignado = asignacion;
                _usuarioRepository.Modify(usuarioJefe);
            }
        }

        // Entrada: dos objetos de tipo cuadrilla
        // Salida: Ninguna.
        // Descripción: Ejecuta los procesos necesarios en caso de que se
        // asignara como jefe de cuadrilla a otro usuario.
        public int? cambioJefes(Cuadrilla cuadrillaBD, Cuadrilla cuadrillaModificada)
        {
            // Obtener el jefe registrado en BD y el jefe que viene con la cuadrilla a modificar
            //int? jefeBD = cuadrillaBD.ID_JefeCuadrilla == null ? null : cuadrillaBD.ID_JefeCuadrilla;
            int? jefeBD = cuadrillaBD.ID_JefeCuadrilla ?? null;
            //int? jefeNuevo = cuadrillaModificada.ID_JefeCuadrilla == null ? null : cuadrillaModificada.ID_JefeCuadrilla;
            int? jefeNuevo = cuadrillaModificada.ID_JefeCuadrilla ?? null;

            // Verificar si se el jefe asignado es el mismo o si cambio, y modificar campo jefeAsignado de usuario
            if (jefeBD != jefeNuevo)
            {
                ModificarUsuarioJefe(jefeBD, false);
                ModificarUsuarioJefe(jefeNuevo, true);
            }

            return jefeNuevo;
        }

        // Entrada: Objeto cuadrilla y mensaje de tipo string.
        // Salida: valor booleano.
        // Descripción: efectúa la eliminación lógica de una cuadrilla y modifica el usuario que se encontraba asignado
        // como jefe de cuadrilla.
        public bool EliminarCuadrilla(Cuadrilla cuadrilla, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            int idJefe = (int)cuadrilla.ID_JefeCuadrilla;
            try
            { 
                ModificarUsuarioJefe(idJefe, false);
                cuadrilla.Disponible = false;
                _cuadrillaRepository.Modify(cuadrilla);
                Message = "¡Cuadrilla  " + cuadrilla.Nombre_cuadrilla + " eliminado con éxito!";
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
