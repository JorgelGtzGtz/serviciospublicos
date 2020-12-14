using dbServiciosPublicos;
using ServiciosPublicos.Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Services
{
    public interface IReporteServicio
    {
        bool AltaReporte(Ticket ticket, List<Imagen> imagenes, out string Message);
        bool ActualizarReporte(Reporte reporte, out string Message);
        List<dynamic> GetAllReportes(string textoBusqueda = null);        
        List<dynamic> GetReporteCuadrilla(int idCuadrilla);
        List<Imagen> GetImagenesReporte(int id, out string Message);        
        bool InsertarImagenesReporte(int idReporte, List<Imagen> imagenes, out string Message);
        int ObtenerIDRegistro();
    }
    public class ReporteServicio : IReporteServicio
    {
        private readonly IReporteRepository _reporteRepository;
        private readonly IReporteTicketRepository _reporteTicketRepository;
        private readonly IImagenRepository _imagenRepository;
        private readonly ITicketRepository _ticketRepository;
        public ReporteServicio(IReporteRepository reporteRepository, 
            IImagenRepository imagenRepository, IReporteTicketRepository reporteTicketRepository,
            ITicketRepository ticketRepository)
        {
            _reporteRepository = reporteRepository;
            _imagenRepository = imagenRepository;
            _reporteTicketRepository = reporteTicketRepository;
            _ticketRepository = ticketRepository;
        }

        public List<dynamic> GetAllReportes(string textoBusqueda = null)
        {
            return this._reporteRepository.GetAllReportes(textoBusqueda);
        }

        public List<dynamic> GetReporteCuadrilla(int idCuadrilla)
        {
            return _reporteRepository.GetReporteCuadrilla(idCuadrilla);
        }

        public int ObtenerIDRegistro()
        {
            return _reporteRepository.ObtenerUltimoID() + 1;
        }


        //Recibe el ticket y las imagenes
        // Primero verifica si el reporte existe. Si existe, solo actualiza el campo para conteo de tickets.
        //Si no existe crea un nuevo reporte. En ambos casos regresa el ID
        //Despues inserta la relacion reporte-ticket
        // Por ultimo, registra las imagenes con los id de reporte y ticket
        public bool AltaReporte(Ticket ticket, List<Imagen> imagenes, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            int idReporte = 0;
            try
            {
                Reporte reporte = _reporteRepository.VerificarExistenciaReporte(ticket);
                if (reporte == null)
                {
                    idReporte = _reporteRepository.InsertarReporte(ticket);
                }
                else
                {
                    _reporteRepository.ModificarNoTickets(reporte);
                    idReporte = reporte.ID_reporte;
                }
                //Insertar registro de relacion reporte - ticket
                _reporteTicketRepository.Insert(ticket.ID_ticket, idReporte);

                //Insertar imagenes
                if (imagenes.Count != 0)
                {
                    foreach (var imagen in imagenes)
                    {
                        _imagenRepository.InsertarImagen(ticket.ID_ticket, idReporte, imagen);
                    }
                }
                result = true;
                Message = "Registro de reporte exitoso";
            }
            catch (Exception ex)
            {
                Message = "Registro de reporte fallido" + ex.Message;
            }
            return result;
        }       

        //Actualizar reporte pasando elemento reporte
        public bool ActualizarReporte(Reporte reporte, out string Message)
        {

            Message = string.Empty;
            bool result = false;
            try
            {
                _reporteRepository.InsertOrUpdate<int>(reporte, "ID_reporte");
                var listaReporTicket = _reporteTicketRepository.GetReporteTickets(reporte.ID_reporte);
                foreach (var reporteTicket in listaReporTicket)
                {
                    Ticket ticket = _ticketRepository.GetTicket(reporteTicket.ID_ticket);
                    ticket = this.ModificacionesTicket(ticket, reporte);
                    _ticketRepository.Modify(ticket);
                } 
                Message = "Reporte actualizado con exito";
                result = true;
            }
            catch (Exception ex)
            {
                Message = "Reporte no pudo ser guardado Error: " + ex.Message;
            }
            return result;
        }

        //Se actualizan los datos del reporte en el ticket
        public Ticket ModificacionesTicket(Ticket ticket, Reporte reporte)
        {
            ticket.ID_tipoReporte = reporte.ID_tipoReporte;
            ticket.Latitud_ticket = reporte.Latitud_reporte;
            ticket.Longitud_ticket = reporte.Longitud_reporte;
            ticket.FechaCierre_ticket = reporte.FechaCierre_reporte;
            ticket.Estatus_ticket = reporte.Estatus_reporte;
            ticket.ID_sector = reporte.ID_sector;
            ticket.ID_cuadrilla = reporte.ID_cuadrilla;
            ticket.TiempoEstimado_ticket = reporte.TiempoEstimado_reporte;
            ticket.Direccion_ticket = reporte.Direccion_reporte;
            ticket.EntreCalles_ticket = reporte.EntreCalles_reporte;
            ticket.Referencia_ticket = reporte.Referencia_reporte;
            ticket.Colonia_ticket = reporte.Colonia_reporte;
            ticket.Poblacion_ticket = reporte.Poblado_reporte;
            ticket.Observaciones_ticket = reporte.Observaciones_reporte;
            return ticket;
        }

        //Obtiene todas las imagenes de los reportes
        public List<Imagen> GetImagenesReporte(int id, out string Message)
        {
            Message = string.Empty;
            List<Imagen> listaImagenes = new List<Imagen>();
            try
            {
                listaImagenes = _imagenRepository.GetImagen(id);
                Message = "Imágenes encontradas con exito";                
            }catch(Exception ex)
            {
                Message = "No fué posible obtener imágenes del reporte. "+ ex;
            }
            return listaImagenes;
        }

        //Insertar imagenes de reporte para cierre. Recibe el reporte y la lista de imagenes
        public bool InsertarImagenesReporte(int idReporte, List<Imagen> imagenes, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                foreach (var imagen in imagenes )
                {
                    _imagenRepository.InsertarImagenCierre(idReporte, imagen);
                    result = true;
                }                
                Message = "Imágenes de cierre se agregaron exitosamente";
            }
            catch (Exception ex)
            {
                Message = "No se pudieron agregar las imágenes de cierre." + ex.Message;
            }
            return result;            
        }

        //Insertar reporte pasando un elemento Reporte
        /* public bool InsertarReporte(Reporte reporte, out string Message)
         {
             Message = string.Empty;
             bool result = false;
             try
             {
                 _reporteRepository.Add<int>(reporte);

                 Message = "Reporte registrado con exito";
                 result = true;
             }
             catch (Exception ex)
             {

                 Message = "Reporte No pudo ser registrado Error: " + ex.Message;
             }

             return result;
         }
        */

    }
}
