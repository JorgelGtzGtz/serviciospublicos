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

        // Entrada: objeto de tipo Reporte_Ticket y mensaje de tipo string
        // Salida: valor boolean
        // Descripción:Insertar nuevo registro de relacion reporte-ticket en base de datos.
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

        // Entrada: ID de reporte de tipo INT
        // Salida: lista de tipo Reporte_Ticket
        // Descripción: Llama al método del reporsitorio de Reporte_Ticket para obtener los registros 
        // relacionados al ID de reporte.
        public List<Reporte_Ticket> GetReporteTickets(int idReporte)
        {
           var reporteTickets = _reporteTicketRepository.GetReporteTickets(idReporte);
            return reporteTickets;
        }

        // Entrada: Ninguna
        // Salida: lista de tipo Reporte_Ticket
        // Descripción: Llama al método del repositorio Reporte_Ticket para obtener los registros
        // de la tabla Reporte_Ticket
        public List<Reporte_Ticket> GetAllReporteTickets()
        {
            var reporteTicketLista = _reporteTicketRepository.GetAllReporteTicket();
            return reporteTicketLista;
        }

        // Entrada: Folio de Reporte_Ticket de tipo INT
        // Salida: Objeto de tipo Reporte_ticket
        // Descripción: Llama al método del repositorio Reporte_Ticket para obtener el registro que
        // coincide con el folio.
        public Reporte_Ticket GetReporteTicket(int folio)
        {
            var registro = _reporteTicketRepository.GetReporteTicket(folio);
            return registro;
        }
    }
}
