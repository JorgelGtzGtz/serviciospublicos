using dbServiciosPublicos;
using ServiciosPublicos.Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Services
{

    public interface IReporteTicketService
    {
        List<Reporte_Ticket> GetReporteTickets(int idReporte);
        List<Reporte_Ticket> GetAllReporteTickets();
        Reporte_Ticket GetReporteTicket(int folio);
        bool Insertar(Reporte_Ticket reporteTicket, out string Message);

    }
    public class ReporteTicketService : IReporteTicketService
    {
        private readonly IReporteTicketRepository _reporteTicketRepository;
        public ReporteTicketService(IReporteTicketRepository reporteTicketRepository)
        {
            _reporteTicketRepository = reporteTicketRepository;
        }

        //Insertar nuevo registro de relacion reporte-ticket
        public bool Insertar(Reporte_Ticket reporteTicket, out string Message)
        {
            bool result = false;
            Message = string.Empty;
            try
            {
                _reporteTicketRepository.Add<int>(reporteTicket);
                Message = "Inserción de relacion reporte-ticket exitosa";
                result = true;

            }catch(Exception ex)
            {
                Message = "Error al insertar relacion reporte - ticket " + ex.Message;
            }

            return result;

        }

        public List<Reporte_Ticket> GetReporteTickets(int idReporte)
        {
           var reporteTickets = _reporteTicketRepository.GetReporteTickets(idReporte);
            return reporteTickets;
        }

        public List<Reporte_Ticket> GetAllReporteTickets()
        {
            var reporteTicketLista = _reporteTicketRepository.GetAllReporteTicket();
            return reporteTicketLista;
        }

        public Reporte_Ticket GetReporteTicket(int folio)
        {
            var registro = _reporteTicketRepository.GetReporteTicket(folio);
            return registro;
        }
    }
}
