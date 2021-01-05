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
        bool ActualizarReporte(Reporte reporte, string path ,out string Message);
        List<dynamic> GetAllReportes(string textoBusqueda = null);        
        List<dynamic> GetReporteCuadrilla(int idCuadrilla);
        List<Imagen> GetImagenesReporte(string idReporte, string tipoImagen, out string Message);
        bool InsertarImagenesReporte(int idReporte, List<Imagen> imagenes, out string Message);
        int ObtenerIDRegistro();
        List<dynamic> GetReporteJefeAsignado(int id_jefe, int idTipo, int idEstatus);
        string SendSMS(out string Message);
    }
    public class ReporteServicio : IReporteServicio
    {
        private readonly IReporteRepository _reporteRepository;
        private readonly IReporteTicketRepository _reporteTicketRepository;
        private readonly IImagenRepository _imagenRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly IUsuarioRepository _usuarioRepository;
        public ReporteServicio(IReporteRepository reporteRepository, 
            IImagenRepository imagenRepository, IReporteTicketRepository reporteTicketRepository,
            ITicketRepository ticketRepository, IUsuarioRepository usuarioRepository)
        {
            _reporteRepository = reporteRepository;
            _imagenRepository = imagenRepository;
            _reporteTicketRepository = reporteTicketRepository;
            _ticketRepository = ticketRepository;
            _usuarioRepository = usuarioRepository;
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
        public bool ActualizarReporte(Reporte reporte, string path ,out string Message)
        {

            Message = string.Empty;
            bool result = false;
            try
            {
                int idReporte = reporte.ID_reporte;
                _reporteRepository.Modify(reporte);
                var listaReporTicket = _reporteTicketRepository.GetReporteTickets(idReporte);

                //ADICIÓN DE ENVIAR CORREO CON IMAGENES EN CASO DE CIERRE DE REPORTE
                string imageMessage = String.Empty;
                List<Imagen> listaImagenes = this.GetImagenesReporte(""+idReporte, ""+2, out imageMessage);


                foreach (var reporteTicket in listaReporTicket)
                {
                    int idTicket = reporteTicket.ID_ticket;
                    Ticket ticket = _ticketRepository.GetTicket(idTicket);
                    ticket = this.ModificacionesTicket(ticket, reporte);
                    _ticketRepository.Modify(ticket);

                    //VERIFICANDO SI EL USUARIO SOLICITO RECIBIR CORREO
                    Usuario usuarioReportante = _usuarioRepository.Get(ticket.ID_usuarioReportante);
                    if (reporte.Estatus_reporte == 2) {
                        if ((bool)ticket.EnviarCorreo_ticket)
                        {
                            _reporteRepository.EnviarCorreo(usuarioReportante.Correo_usuario, "Reporte finalizado", "Texto sin formato", listaImagenes, path);
                        }
                    }
                    
                    
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
            ticket.FechaCierre_ticket = reporte.FechaCierre_reporte;
            ticket.Estatus_ticket = reporte.Estatus_reporte;
            ticket.ID_cuadrilla = reporte.ID_cuadrilla;
            ticket.TiempoEstimado_ticket = reporte.TiempoEstimado_reporte;
            // ticket.ID_tipoReporte = reporte.ID_tipoReporte;
            // ticket.Latitud_ticket = reporte.Latitud_reporte;
            // ticket.Longitud_ticket = reporte.Longitud_reporte;
            // ticket.ID_sector = reporte.ID_sector;           
            // ticket.Direccion_ticket = reporte.Direccion_reporte;
            // ticket.EntreCalles_ticket = reporte.EntreCalles_reporte;
            // ticket.Referencia_ticket = reporte.Referencia_reporte;
            // ticket.Colonia_ticket = reporte.Colonia_reporte;
            // ticket.Poblacion_ticket = reporte.Poblado_reporte;
            // ticket.Observaciones_ticket = reporte.Observaciones_reporte;
            return ticket;
        }

        //Obtiene todas las imagenes de los reportes
        public List<Imagen> GetImagenesReporte(string idReporte,string tipoImagen, out string Message)
        {
            Message = string.Empty;
            List<Imagen> listaImagenes = new List<Imagen>();
            try
            {
                var idRep = Int32.Parse(idReporte);
                var tipo = Int32.Parse(tipoImagen);
                listaImagenes = _imagenRepository.GetImagen(idRep, tipo);
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

        public List<dynamic> GetReporteJefeAsignado(int id_jefe, int idTipo, int idEstatus)
        {
            return this._reporteRepository.reportePorJefe(id_jefe, idTipo, idEstatus);
        }

        public string SendSMS(out string Message)
        {
            Message = _reporteRepository.EnviarSMS("526442513016", "voltea menso");
            return Message;
        }

    }
}
