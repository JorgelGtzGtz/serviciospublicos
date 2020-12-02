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
        Cuadrilla GetCuadrilla(int id);
        List<dynamic> GetCuadrillaList();
    }
    public class CuadrillaService: ICuadrillaService
    {
        private readonly ICuadrillaRepository _cuadrillaRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly IReporteRepository _reporteRepository;

        public CuadrillaService(ICuadrillaRepository cuadrillaRepository, ITicketRepository ticketRepository, IReporteRepository reporteRepository )
        {
            _cuadrillaRepository = cuadrillaRepository;
            _ticketRepository = ticketRepository;
            _reporteRepository = reporteRepository;
        }

        //Obtener cuadrilla buscando por ID
        public Cuadrilla GetCuadrilla(int id)
        {
            var valor = _cuadrillaRepository.GetCuadrilla(id);
            return valor;
        }

        //Obtener lista de cuadrillas
        public List<dynamic> GetCuadrillaList()
        {
            return _cuadrillaRepository.GetCuadrillaList();
        }

        //Insertar cuadrilla, recibe un objeto cuadrilla y devuelve un valor booleando
        // que informa si la operacion fue exitosa o no
        public bool InsertarCuadrilla(Cuadrilla cuadrilla, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                _cuadrillaRepository.Add<int>(cuadrilla);
                Message = "Cuadrilla " + cuadrilla.Nombre_cuadrilla + " registrada con exito";
                result = true;
            }
            catch (Exception ex)
            {
                Message = "No se puede realizar el registro de cuadrilla "+cuadrilla.Nombre_cuadrilla +" "+ex.Message;
            }
            return result;
        }

        //Actualizar cuadrilla, recibe un objeto cuadrilla
        public bool ActualizarCuadrilla(Cuadrilla cuadrilla, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                _cuadrillaRepository.Modify(cuadrilla);
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
                //VERIFICAR QUE NO EXISTAN REGISTROS CON ESTA CUADRILLA EN TICKETS Y REPORTES
                Sql queryTicket = new Sql()
                .Select("*").From("Ticket")
                .Where("ID_cuadrilla = @0", id);
                Ticket ticket = _ticketRepository.Get(queryTicket);

                Sql queryReporte = new Sql()
                    .Select("*").From("Reporte")
                    .Where("ID_cuadrilla = @0", id);
                Reporte reporte = _reporteRepository.Get(queryReporte);

                //SI NO ESTA REFERENCIADA EN REPORTES NI TICKETS, SE ELIMINA
                if (ticket == null && reporte == null)
                {                    
                    _cuadrillaRepository.Remove(cuadrilla);
                    Message = "Cuadrilla  " + cuadrilla.Nombre_cuadrilla + " eliminado con exito";
                    result = true;
                }
                else
                {
                    Message = "Cuadrilla  " + cuadrilla.Nombre_cuadrilla + " no puede ser eliminado porque " +
                                "está asignada a reportes";
                }
            }
            catch (Exception ex)
            {
                Message = "Cuadrilla no pudo ser eliminada Error: " + ex.Message;
            }
            return result;
        }
    }
}
