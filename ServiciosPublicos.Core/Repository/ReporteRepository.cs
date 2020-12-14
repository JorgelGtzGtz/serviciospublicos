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
    public interface IReporteRepository: IRepositoryBase<Reporte>
    {
        Reporte VerificarExistenciaReporte(Ticket ticket);
        int InsertarReporte(Ticket ticket);
        void ModificarNoTickets(Reporte reporte);
        List<dynamic> GetReporteCuadrilla(int idCuadrilla);
        List<dynamic> GetAllReportes(string textoBusqueda = null);
        List<Reporte> ReportesPorCuadrilla(int idCuadrilla);
        int ObtenerUltimoID();

    }
    public class ReporteRepository : RepositoryBase<Reporte>, IReporteRepository
    {
        public ReporteRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        //verificar si existe reporte usando la direccion y tipo de reporte
        public Reporte VerificarExistenciaReporte(Ticket ticket)
        {
            Sql query = new Sql(
                @"SELECT * FROM Reporte WHERE (
          acos(sin(Latitud_reporte * 0.0175) * sin(@0 * 0.0175) 
               + cos(Latitud_reporte * 0.0175) * cos(@0 * 0.0175) *    
                 cos((@1 * 0.0175) - (Longitud_reporte * 0.0175))
              ) * 3959 <= 0.16
      ) AND ID_tipoReporte = @2", ticket.Latitud_ticket, ticket.Longitud_ticket, ticket.ID_tipoReporte);
            return this.Context.SingleOrDefault<Reporte>(query);
        }

        public List<dynamic> GetReporteCuadrilla(int idCuadrilla)
        {
            Sql query = new Sql(
                @"SELECT reporte.*, sector.Descripcion_sector AS sector, cuadrilla.Nombre_cuadrilla AS cuadrilla 
                  FROM hiram74_residencias.Reporte AS reporte
                  INNER JOIN Sector AS sector ON sector.ID_sector = reporte.ID_sector
                  INNER JOIN Cuadrilla AS cuadrilla ON cuadrilla.ID_cuadrilla = reporte.ID_cuadrilla 
                  WHERE ID_cuadrilla= @0",
                idCuadrilla);
            return this.Context.Fetch<dynamic>(query);
        }

        //Se crea un reporte con las caracteristicas del ticket
        // NoTickets de reporte es 1, porque es la primera vez que se hace un ticket de este reporte
        // estatus_reporte es 1, porque es abierto
        public int InsertarReporte(Ticket ticket)
        {
            Reporte reporte = new Reporte();
            reporte.ID_tipoReporte = ticket.ID_tipoReporte;
            reporte.Latitud_reporte = ticket.Latitud_ticket;
            reporte.Longitud_reporte = ticket.Longitud_ticket;
            reporte.FechaRegistro_reporte = ticket.FechaRegistro_ticket;
            reporte.NoTickets_reporte = 1;
            reporte.Estatus_reporte = 1;
            reporte.ID_sector = ticket.ID_sector;
            reporte.ID_cuadrilla = ticket.ID_cuadrilla;
            reporte.Direccion_reporte = ticket.Direccion_ticket;
            reporte.EntreCalles_reporte = ticket.EntreCalles_ticket;
            reporte.Referencia_reporte = ticket.Referencia_ticket;
            reporte.Colonia_reporte = ticket.Colonia_ticket;
            reporte.Poblado_reporte = ticket.Poblacion_ticket;
            reporte.Observaciones_reporte = ticket.Observaciones_ticket;
            reporte.Origen = ticket.Origen;
            return this.Add<int>(reporte);
        }
        
        //Modifica el contador de tickets del reporte.
        public void ModificarNoTickets(Reporte reporte)
        {
            reporte.NoTickets_reporte = reporte.NoTickets_reporte + 1;
            this.Modify(reporte);
        }

        public List<dynamic> GetAllReportes(string textoBusqueda = null)
         {
             string filter = " Where ";

             if (!string.IsNullOrEmpty(textoBusqueda))
             {
                 filter += string.Format("reporte.ID_cuadrilla like '%{0}%' or " +
                                         "reporte.ID_sector like '%{0}%' or " +
                                         "reporte.Origen like '%{0}%' or " +
                                         "reporte.Estatus_reporte like '%{0}%'", textoBusqueda);
             }
            

             Sql query = new Sql(@"SELECT reporte.*, sector.Descripcion_sector AS sector, cuadrilla.Nombre_cuadrilla AS cuadrilla 
                                FROM hiram74_residencias.Reporte AS reporte
                                INNER JOIN Sector AS sector ON sector.ID_sector = reporte.ID_sector
                                INNER JOIN Cuadrilla AS cuadrilla ON cuadrilla.ID_cuadrilla = reporte.ID_cuadrilla" + (!string.IsNullOrEmpty(textoBusqueda) ? filter : ""));
             return this.Context.Fetch<dynamic>(query);
         }

        public List<Reporte> ReportesPorCuadrilla(int idCuadrilla)
        {
            Sql query = new Sql()
                    .Select("*").From("Reporte")
                    .Where("ID_cuadrilla = @0", idCuadrilla);
            return this.Context.Fetch<Reporte>(query);

        }

        public int ObtenerUltimoID()
        {
            Sql query = new Sql(@"SELECT IDENT_CURRENT('Reporte')");
            return this.Context.SingleOrDefault<int>(query);
        }

    }
}
