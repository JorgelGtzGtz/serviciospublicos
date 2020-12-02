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

        public void Insert(int idTicket, int idReporte)
        {
            Reporte_Ticket reporteTicket = new Reporte_Ticket();
            reporteTicket.ID_reporte = idReporte;
            reporteTicket.ID_ticket = idTicket;
            this.Add<int>(reporteTicket);
        }

        //Devuelve una lista con los registro reporte-ticket 
        //relacionados al id del reporte
        public List<Reporte_Ticket> GetReporteTickets(int idReporte)
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Reporte_Ticket")
                .Where("ID_reporte = @0", idReporte);

            var ticketsReporte = this.Context.Fetch<Reporte_Ticket>(query);

            return ticketsReporte;
        }


        //Devuelve solo el registro que coincida con el folio.
        public Reporte_Ticket GetReporteTicket(int folio)
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Reporte_Ticket")
                .Where("Folio_RepTicket = @0", folio);

            var ticketReporte = this.Context.SingleOrDefault<Reporte_Ticket>(query);

            return ticketReporte;
        }

        //Devuelve todos los registros de la tabla
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
