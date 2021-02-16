using dbServiciosPublicos;
using PetaPoco;
using ServiciosPublicos.Core.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EASendMail;
using System.Net;
using System.IO;

namespace ServiciosPublicos.Core.Repository
{
    public interface IReporteRepository: IRepositoryBase<Reporte>
    {
        Reporte VerificarExistenciaReporte(Ticket ticket);
        int InsertarReporte(Ticket ticket);
        void ModificarNoTickets(Reporte reporte);
        List<dynamic> GetReporteFiltroCuadrilla(string idCuadrilla);
        List<dynamic> GetReportesFiltroDinamico(string tipoR, string cuadrilla, string estado, string sector, string origen, string fechaIni, string fechaF, string tipoFecha);
        List<Reporte> ReportesPorCuadrilla(int idCuadrilla);
        int ObtenerUltimoID();
        List<dynamic> reportePorJefe(int id_jefe, int idTipo, int idEstatus, int page, int results);
        string EnviarCorreo(string correoDestino, string asunto, string tipoR, string colonia, List<Imagen> listaImagenes, string path);
        string llenarBodyHtml(string tipoReporte, string colonia);
        string EnviarSMS(string numeroDestino, string mensajeSMS);

    }
    public class ReporteRepository : RepositoryBase<Reporte>, IReporteRepository
    {
        public ReporteRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        // Entrada: objeto de tipo Ticket
        // Salida: objeto de tipo Reporte
        // Descripción: query para verificar si existe reporte usando la direccion y tipo de reporte
        public Reporte VerificarExistenciaReporte(Ticket ticket)
        {
            Sql query = new Sql(
                @"SELECT * FROM Reporte WHERE (
          acos(sin(Latitud_reporte * 0.0175) * sin(@0 * 0.0175) 
               + cos(Latitud_reporte * 0.0175) * cos(@0 * 0.0175) *    
                 cos((@1 * 0.0175) - (Longitud_reporte * 0.0175))
              ) * 3959 <= 0.16
      ) AND ID_tipoReporte = @2 AND Estatus_reporte != 2 AND Estatus_reporte != 4", ticket.Latitud_ticket, ticket.Longitud_ticket, ticket.ID_tipoReporte);
            return this.Context.SingleOrDefault<Reporte>(query);
        }

        // Entrada: id de cuadrilla de tipo string
        // Salida: lista de tipo dynamic con los registros de la consulta.
        // Descripción: query para hacer una búsqueda dinámica de reportes. Como filtro se toma el id de cuadrilla.
        public List<dynamic> GetReporteFiltroCuadrilla(string idCuadrilla)
        {
            string filter = " WHERE ";
            bool operacion = false;

            if (!string.IsNullOrEmpty(idCuadrilla))
            {
                filter += string.Format("reporte.ID_cuadrilla LIKE '%{0}%'", idCuadrilla);
                operacion = true;
            }

            Sql query = new Sql(
                @"SELECT reporte.*, sector.Descripcion_sector AS sectorDescripcion 
                  FROM hiram74_residencias.Reporte AS reporte
                  INNER JOIN Sector AS sector ON sector.ID_sector = reporte.ID_sector" + (operacion ? filter : ""));
            return this.Context.Fetch<dynamic>(query);
        }

        // Entrada: Objeto de tipo Ticket
        // Salida: Id del reporte creado de tipo int.
        // Descripción: Se crea un reporte con las caracteristicas del ticket
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

        // Entrada: Objeto de tipo Reporte
        // Salida: Ninguna.
        // Descripción: al numero de tickets del reporte, incrementa en 1 y actualiza el reporte en la base de datos.
        public void ModificarNoTickets(Reporte reporte)
        {
            reporte.NoTickets_reporte = reporte.NoTickets_reporte + 1;
            this.Modify(reporte);
        }


        // Entrada: valores string para tipo reporte, estado, sector, origen, fecha inicial y fecha final
        // Salida: lista de tipo dynamic, con los registros que coincidieron.
        // Descripción: Ejecuta un query cuya estructura se crea segun los valores que tienen datos
        // con el fin de buscar registros que cumplan determinados filtros.
        public List<dynamic> GetReportesFiltroDinamico(string tipoR, string cuadrilla, string estado, string sector, string origen, string fechaIni, string fechaF, string tipoFecha)
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

            if (!string.IsNullOrEmpty(fechaIni) && !string.IsNullOrEmpty(fechaF) && tipoFecha.Equals("a"))
            {
                filter += (operacion ? " AND " : "") + string.Format("(reporte.FechaRegistro_reporte BETWEEN '{0}' AND '{1}')", fechaIni, fechaF);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(fechaIni) && !string.IsNullOrEmpty(fechaF) && tipoFecha.Equals("c"))
            {
                filter += (operacion ? " AND " : "") + string.Format("(reporte.FechaCierre_reporte BETWEEN '{0}' AND '{1}') AND reporte.Estatus_reporte = 2", fechaIni, fechaF);
                operacion = true;
            }

            Sql query = new Sql(@"SELECT reporte.*, sector.Descripcion_sector AS sectorDescripcion
                                  FROM [hiram74_residencias].[Reporte] reporte
                                  INNER JOIN [hiram74_residencias].[Sector] sector
                                  ON sector.ID_sector = reporte.ID_sector" + (operacion ? filter : ""));
             return this.Context.Fetch<dynamic>(query);
         }

        // Entrada: id de cuadrilla de tipo Int
        // Salida: lista de tipo Reporte.
        // Descripción: query que se llama desde la eliminación de cuadrilla, para verificar que
        // la cuadrilla no tenga reportes relacionados.
        public List<Reporte> ReportesPorCuadrilla(int idCuadrilla)
        {
            Sql query = new Sql()
                    .Select("*").From("Reporte")
                    .Where("ID_cuadrilla = @0", idCuadrilla);
            return this.Context.Fetch<Reporte>(query);

        }

        // Entrada: Ninguna.
        // Salida: id de reporte de tipo int.
        // Descripción: query que obtiene el último ID de reporte registrado en la base de datos.
        public int ObtenerUltimoID()
        {
            Sql query = new Sql(@"SELECT IDENT_CURRENT('Reporte')");
            return this.Context.SingleOrDefault<int>(query);
        }

        public List<dynamic> reportePorJefe(int id_jefe, int idTipo, int idEstatus, int page, int results)
        {
            Sql query = new Sql(@"SELECT reporte.*, cuadrilla.ID_JefeCuadrilla AS jefeAsignado, tipoReporte.Descripcion_tipoReporte AS nombreTipo
                                FROM [hiram74_residencias].[Reporte] reporte
                                INNER JOIN [hiram74_residencias].[Cuadrilla] cuadrilla 
                                ON cuadrilla.ID_cuadrilla = reporte.ID_cuadrilla INNER JOIN [hiram74_residencias].[Tipo_Reporte] tipoReporte 
								ON tipoReporte.ID_tipoReporte = reporte.ID_tipoReporte WHERE cuadrilla.ID_JefeCuadrilla = @0" +
                                (idTipo != 0 ? " AND reporte.ID_tipoReporte = @1" : "") +
                                (idEstatus != 0 ? " AND reporte.Estatus_reporte = @2" : "")
                                + " order by reporte.ID_reporte desc OFFSET @3 ROWS FETCH NEXT @4 ROWS ONLY"
                                , id_jefe, idTipo, idEstatus, page, results);
            return this.Context.Fetch<dynamic>(query);
        }
        //G:METODO PARA ENVIAR CORREO CON IMAGENES DE CIERRE, SE ENVIA AL USUARIO CON IMAGENES ADJUNTAS
        public string EnviarCorreo(string correoDestino, string asunto, string tipoR, string colonia, List<Imagen> listaImagenes, string path)
        {
            string mensaje = "Error al enviar correo.";
            string html = String.Empty;

            try
            {
                SmtpMail objetoCorreo = new SmtpMail("TryIt");

                objetoCorreo.From = "publicosservicios745@gmail.com";
                objetoCorreo.To = correoDestino;
                objetoCorreo.Subject = asunto;
                /*html += "<h4>El problema fue solucionado correctamente</h4>";
                html += "<h3>A continuacion te anexamos las pruebas solicitadas por ti...</h3>";
                */
                objetoCorreo.HtmlBody = llenarBodyHtml(tipoR, colonia);

                foreach (var imagen in listaImagenes) {
                    objetoCorreo.AddAttachment(path + imagen.Path_imagen.Replace("/", @"\"));
                }
               
                SmtpServer objetoServidor = new SmtpServer("smtp.gmail.com");

                objetoServidor.User = "publicosservicios745@gmail.com";
                objetoServidor.Password = "public329";
                objetoServidor.Port = 587;
                objetoServidor.ConnectType = SmtpConnectType.ConnectSSLAuto;

                SmtpClient objetoCliente = new SmtpClient();
                objetoCliente.SendMail(objetoServidor, objetoCorreo);
                mensaje = "Correo Enviado Correctamente.";


            }
            catch (Exception ex)
            {
                mensaje = "Error al enviar correo." + ex.Message;
            }
            return mensaje;
        }

        public string llenarBodyHtml(string tipoReporte, string colonia)
        {
            string body = string.Empty;
            using (StreamReader reader = new StreamReader(System.Web.Hosting.HostingEnvironment.MapPath("~/Templates/cierreReporte.html")))
            {
                body = reader.ReadToEnd();
            }
            body = body.Replace("{tipoReporte}", tipoReporte);
            body = body.Replace("{colonia}", colonia);

            return body;

        }

        //G: METODO PARA ENVIAR SMS
        public string EnviarSMS(string numeroDestino, string mensajeSMS)
        {
            string mensaje = "Error al enviar el SMS.";

            try
            {
                WebClient client = new WebClient();
                Stream s = client.OpenRead(string.Format("https://platform.clickatell.com/messages/http/send?apiKey=r1ELr7LbS4Gj3v9UIRQlEw==&to={0}&content={1}", numeroDestino, mensajeSMS));
                StreamReader reader = new StreamReader(s);
                string result = reader.ReadToEnd();
                mensaje = "SMS Enviado Correctamente.";
            }
            catch (Exception ex)
            {
                mensaje = "Error al enviar SMS." + ex.Message;
            }
            return mensaje;
        }

    }
}
