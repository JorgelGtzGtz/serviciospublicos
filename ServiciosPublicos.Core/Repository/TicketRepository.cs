using dbServiciosPublicos;
using PetaPoco;
using ServiciosPublicos.Core.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Repository
{
    public interface ITicketRepository : IRepositoryBase<Ticket>
    {
         Ticket GetTicket(int id);
         List<Ticket> GetSectoresTicket(int idSector);
        List<Ticket> ticketsPorCuadrilla(int idCuadrilla);
    }
    public class TicketRepository : RepositoryBase<Ticket>, ITicketRepository
    {
        public TicketRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        // Entrada: valor INT del ID del ticket.
        // Salida: Objeto de tipo Ticket
        // Descripción: Ejecuta un query para buscar un ticket por su ID en la base de datos.
        public Ticket GetTicket(int id)
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Ticket")
                .Where("lower(ID_ticket) = @0", id);

            var ticket = this.Context.SingleOrDefault<Ticket>(query);

            return ticket;
        }

        // Entrada: ID de sector de tipo INT
        // Salida: Lista de tipo Ticket.
        // Descripción: query para consultar tickets por ID de sector
        public List<Ticket> GetSectoresTicket(int idSector)
        {
            Sql query = new Sql()
                .Select("*").From("Ticket")
                .Where("ID_sector = @0", idSector);
            return this.GetByFilter(query);

        }

        // Entrada: ID de cuadrilla de tipo INT
        // Salida: Lista de tipo Ticket.
        // Descripción: Query para consultar tickets por ID de cuadrilla.
        public List<Ticket> ticketsPorCuadrilla(int idCuadrilla)
        {
            Sql queryTicket = new Sql()
                .Select("*").From("Ticket")
                .Where("ID_cuadrilla = @0", idCuadrilla);
            return this.Context.Fetch<Ticket>(queryTicket);
        }

    }
}
