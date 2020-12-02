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
    }
    public class TicketRepository : RepositoryBase<Ticket>, ITicketRepository
    {
        public TicketRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        public Ticket GetTicket(int id)
        {
            var query = new Sql()
                .Select("*")
                .From("hiram74_residencias.Ticket")
                .Where("lower(ID_ticket) = @0", id);

            var ticket = this.Context.SingleOrDefault<Ticket>(query);

            return ticket;
        }

        //Buscar si existe un ticket,
        // por id de sector
        public List<Ticket> GetSectoresTicket(int idSector)
        {
            Sql query = new Sql()
                .Select("*").From("Ticket")
                .Where("ID_sector = @0", idSector);
            return this.GetByFilter(query);

        }

    }
}
