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
    public interface ITicketService
    {
        Ticket GetTicket(int id);
        List<Ticket> GetTickets();
        int InsertarTicket(Ticket ticket, out string Message);
        bool ActualizarTicket(Ticket ticket, out string Message);
        List<dynamic> GetTicketsByUserID(int id, int id_tipo, int id_estatus);

        List<Imagen> GetImagenesByTicket(string idTicket, out string Message);
    }
    public class TicketService : ITicketService
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IReporteRepository _reporteRepository;
        private readonly IImagenRepository _imagenRepository;
        private readonly IReporteTicketRepository _reporteTicketRepository;

        public TicketService(ITicketRepository ticketRepository, IImagenRepository imagenRepository, IReporteRepository reporteRepository, IReporteTicketRepository reporteTicketReporsitory)
        {
            _ticketRepository = ticketRepository;
            _imagenRepository = imagenRepository;
            _reporteRepository = reporteRepository;
            _reporteTicketRepository = reporteTicketReporsitory;
        }

        // Entrada: valor INT con ID de ticket
        // Salida: objeto de tipo Ticket.
        // Descripción: Llama al método del repositorio de Ticket para
        // ejecutar una consulta de un ticket.
        public Ticket GetTicket(int id)
        {
            return _ticketRepository.GetTicket(id);

        }

        // Entrada: Ninguna.
        // Salida: Lista tipo Ticket.
        // Descripción: Obtiene todos los registros de tickets existentes en tabla Ticket de la base de datos.
        public List<Ticket> GetTickets()
        {
            return _ticketRepository.GetAll("hiram74_residencias.Ticket").ToList();
        }

        public List<dynamic> GetTicketsByUserID(int id, int id_tipo, int id_estatus)
        {
            return _ticketRepository.ticketsPorUsuario(id, id_tipo, id_estatus);
        }

        public int InsertarTicket(Ticket ticket, out string Message)
        {
            Message = string.Empty;
            var idTicket = 0;
            try
            {
               idTicket = _ticketRepository.Add<int>(ticket);

                Message = "Ticket registrado con exito";
            }
            catch (Exception ex)
            {
                Message = "Usuario No pudo ser registrado Error: " + ex.Message;
            }
            return idTicket;
        }

        // Entrada: Objeto de tipo Ticket y mensaje de tipo string
        // Salida: alor de tipo booleano.
        // Descripción: Actualiza la información de un registro de la base de datos
        // mediante el método Modify del repositorio.
        public bool ActualizarTicket(Ticket ticket, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                _ticketRepository.Modify(ticket);
                Message = "Ticket actualizado con exito";
                result = true;
            }
            catch (Exception ex)
            {
                Message = "Ticket no pudo ser actualizado Error: " + ex.Message;
            }
            return result;
        }
        public List<Imagen> GetImagenesByTicket(string idTicket,out string Message)
        {
            Message = string.Empty;
            List<Imagen> listaImagenes = new List<Imagen>();
            try
            {
                var idTic = Int32.Parse(idTicket);
                listaImagenes = _imagenRepository.GetImagenTickets(idTic);
                Message = "Imágenes encontradas con exito";
            }
            catch (Exception ex)
            {
                Message = "No fué posible obtener imágenes del reporte. " + ex;
            }
            return listaImagenes;
        }
    }
}
