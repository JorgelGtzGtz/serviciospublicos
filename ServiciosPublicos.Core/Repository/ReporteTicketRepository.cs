using dbServiciosPublicos;
using ServiciosPublicos.Core.Factories;
using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Repository
{
    public interface IReporteTicketRepository : IRepositoryBase<Reporte_Ticket>
    {
        List<Reporte_Ticket> GetAllReporteTicket();
        Reporte_Ticket GetReporteTicket(int folio);
        List<Reporte_Ticket> GetReporteTickets(int idReporte);
        void Insert(int idTicket, int idReporte);

    }

    public class ReporteTicketRepository :  RepositoryBase<Reporte_Ticket>, IReporteTicketRepository
    {
        public ReporteTicketRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        // Entrada: ID de ticket de tipo INT y ID de reporte de tipo INT
        // Salida: vacío.
        // Descripción: Crea un objeto de tipo Reporte_Ticket y asigna los valores de ID's correspondientes
        // para después insertarlos en la base de datos.
        public void Insert(int idTicket, int idReporte)
        {
            Reporte_Ticket reporteTicket = new Reporte_Ticket();
            reporteTicket.ID_reporte = idReporte;
            reporteTicket.ID_ticket = idTicket;
            this.Add<int>(reporteTicket);
        }

        // Entrada: ID de reporte de tipo INT
        // Salida: Lista de tipo Reporte_Ticket.
        // Descripción: realiza una consulta para obtener una lista con los registro reporte-ticket 
        //relacionados al id del reporte.
        public List<Reporte_Ticket> GetReporteTickets(int idReporte)
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Reporte_Ticket")
                .Where("ID_reporte = @0", idReporte);

            var ticketsReporte = this.Context.Fetch<Reporte_Ticket>(query);

            return ticketsReporte;
        }

        // Entrada: folio Reporte_Ticket de tipo INT.
        // Salida: Objeto de tipo Reporte_Ticket.
        // Descripción: Query para obtener el registro de tabla Reporte_Ticket que coincide con el folio.
        public Reporte_Ticket GetReporteTicket(int folio)
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Reporte_Ticket")
                .Where("Folio_RepTicket = @0", folio);

            var ticketReporte = this.Context.SingleOrDefault<Reporte_Ticket>(query);

            return ticketReporte;
        }

        // Entrada: Ninguna
        // Salida: Vacío.
        // Descripción: Query para obtener todos los registros de la tabla Reporte_Ticket
        public List<Reporte_Ticket> GetAllReporteTicket()
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Reporte_Ticket");

            var ticketReporte = this.Context.Fetch<Reporte_Ticket>(query);

            return ticketReporte;
        }


    }
}
