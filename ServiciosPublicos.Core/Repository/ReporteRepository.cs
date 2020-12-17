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
        List<dynamic> GetReportesFiltroDinamico(string tipoR, string cuadrilla, string estado, string sector, string origen, string fechaIni, string fechaF);
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


        // Entrada: valores string para tipo reporte, estado, sector, origen, fecha inicial y fecha final
        // Salida: lista de tipo dynamic, con los registros que coincidieron.
        // Descripción: Ejecuta un query cuya estructura se crea segun los valores que tienen datos
        // con el fin de buscar registros que cumplan determinados filtros.
        public List<dynamic> GetReportesFiltroDinamico(string tipoR, string cuadrilla, string estado, string sector, string origen, string fechaIni, string fechaF)
         {
             string filter = " WHERE ";
            bool operacion = false;

             if (!string.IsNullOrEmpty(tipoR))
             {
                 filter += string.Format("reporte.ID_tipoReporte LIKE '%{0}%'", tipoR);
                operacion = true;
             }

            if (!string.IsNullOrEmpty(cuadrilla))
            {
                filter += (operacion ? " AND " : "") + string.Format("reporte.ID_cuadrilla LIKE '%{0}%'", cuadrilla);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(estado))
            {
                filter += (operacion ? " AND " : "") + string.Format("reporte.Estatus_reporte LIKE '%{0}%'", estado);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(sector))
            {
                filter += (operacion ? " AND " : "") + string.Format("reporte.ID_sector LIKE '%{0}%'", sector);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(origen))
            {
                filter += (operacion ? " AND " : "") + string.Format("reporte.Origen LIKE '%{0}%'", origen);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(fechaIni))
            {
                filter += (operacion ? " AND " : "") + string.Format("(reporte.FechaRegistro_reporte >= '{0}' OR reporte.FechaCierre_reporte >= '{0}')", fechaIni);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(fechaF))
            {
                filter += (operacion ? " AND " : "") + string.Format("(reporte.FechaRegistro_reporte <= '{0}' OR reporte.FechaCierre_reporte <= '{0}')", fechaF);
                operacion = true;
            }

           /* if (!string.IsNullOrEmpty(fechaIni) && !string.IsNullOrEmpty(fechaF))
            {
                filter += (operacion ? " AND " : "") + string.Format("(reporte.FechaRegistro_reporte BETWEEN '%{0}%' AND '%{1}%' OR " +
                                                                       "reporte.FechaCierre_reporte BETWEEN '%{0}%' AND '%{1}%')", fechaIni,fechaF);
                operacion = true;
            }
           */




            Sql query = new Sql(@"SELECT reporte.*, sector.Descripcion_sector AS sectorDescripcion
                                  FROM [hiram74_residencias].[Reporte] reporte
                                  INNER JOIN [hiram74_residencias].[Sector] sector
                                  ON sector.ID_sector = reporte.ID_sector" + (operacion ? filter : ""));
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
