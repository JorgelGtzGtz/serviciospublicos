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
        bool EliminarTicket(int id, out string Message);
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

        public Ticket GetTicket(int id)
        {
            return _ticketRepository.GetTicket(id);

        }

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

        public bool EliminarTicket(int id, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                var ticket = _ticketRepository.GetTicket(id);

                _ticketRepository.Remove(ticket);

                Message = "Ticket eliminado con exito";
                result = true;
            }
            catch (Exception ex)
            {
                Message = "Ticket no pudo ser eliminado Error: " + ex.Message;
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
