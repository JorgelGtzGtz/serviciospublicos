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
        List<dynamic> GetReportesFiltro(string tipoR, string cuadrilla, string estado, string sector, string origen, string fechaIni, string fechaF, string tipoFecha);
        List<dynamic> GetReporteFiltroCuadrilla(string idCuadrilla);
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
        private readonly ITipoReporteRepository _tipoReporteRepository;
        public ReporteServicio(IReporteRepository reporteRepository, 
            IImagenRepository imagenRepository, IReporteTicketRepository reporteTicketRepository,
            ITicketRepository ticketRepository, IUsuarioRepository usuarioRepository, ITipoReporteRepository tipoReporteRepository)
        {
            _reporteRepository = reporteRepository;
            _imagenRepository = imagenRepository;
            _reporteTicketRepository = reporteTicketRepository;
            _ticketRepository = ticketRepository;
            _usuarioRepository = usuarioRepository;
            _tipoReporteRepository = tipoReporteRepository;
        }

        // Entrada: valores de tipo string que funcionan como filtros para la búsqueda de registros.
        // Salida: lista de tipo dynamic con los registros de reportes.
        // Descripción: Método para ejecutar el query que realiza una búsqueda dinámica de reportes
        // de acuerdo a los diversos filtros que se indican.
        public List<dynamic> GetReportesFiltro(string tipoR, string cuadrilla, string estado, string sector, string origen, string fechaIni, string fechaF, string tipoFecha)
        {           
            return this._reporteRepository.GetReportesFiltroDinamico(tipoR,cuadrilla,estado,sector,origen,fechaIni,fechaF, tipoFecha);
        }

        // Entrada: id de cuadrilla de tipo string
        // Salida: lista de tipo dynamic con los registros de reportes.
        // Descripción: Método para ejecutar el query que realiza una búsqueda dinámica de reportes
        // tomando como filtro las cuadrillas.
        public List<dynamic> GetReporteFiltroCuadrilla(string idCuadrilla)
        {
            return _reporteRepository.GetReporteFiltroCuadrilla(idCuadrilla);
        }

        // Entrada: Ninguna
        // Salida: ID de reporte de tipo Int
        // Descripción: Método que llama a ejecutar el query para obtener el último ID
        // de reporte registrado, y le suma 1.
        public int ObtenerIDRegistro()
        {
            return _reporteRepository.ObtenerUltimoID() + 1;
        }

        // Entrada: objeto de tipo Ticket, lista de tipo Imagen y mensaje de tipo String.
        // Salida: valor booleano.
        // Descripción: Primero verifica si el reporte existe. Si existe, solo actualiza el campo para conteo de tickets.
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
                    Message = "¡Registro de reporte exitoso! Refierase a este caso con la clave de reporte no. " + idReporte;
                }
                else
                {
                    _reporteRepository.ModificarNoTickets(reporte);
                    idReporte = reporte.ID_reporte;
                    Message = "¡Registro de reporte exitoso! El reporte se relacionó a un reporte ya existente. " +
                              "Refierase a este caso con la clave de reporte no. " + idReporte;
                }
                //Insertar registro de relacion reporte - ticket
                _reporteTicketRepository.Insert(ticket.ID_ticket, idReporte);

                //Insertar imagenes
                if (imagenes.Count != 0)
                {
                    foreach (var imagen in imagenes)
                    {
                        _imagenRepository.InsertarImagen( idReporte, imagen, ticket.ID_ticket);
                    }
                }
                result = true;
                
            }
            catch (Exception ex)
            {
                Message = "Registro de reporte fallido" + ex.Message;
            }
            return result;
        }

        // Entrada: Objeto de tipo Reporte y mensaje de tipo string
        // Salida: valor booleano.
        // Descripción: Actualiza el reporte pasado como argumento y los tickets relacionados
        // con este reporte.
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
                            Tipo_Reporte tipoR = _tipoReporteRepository.Get<int>(reporte.ID_tipoReporte);
                            string descripcionTR = tipoR.Descripcion_tipoReporte;
                            string coloniaR = reporte.Colonia_reporte;
                            _reporteRepository.EnviarCorreo(usuarioReportante.Correo_usuario, "Reporte finalizado", descripcionTR, coloniaR, listaImagenes, path);
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

        // Entrada: objeto Ticket y objeto Reporte
        // Salida: objeto Ticket.
        // Descripción: Se actualizan los datos del ticket con los nuevos datos del reporte
        public Ticket ModificacionesTicket(Ticket ticket, Reporte reporte)
        {
            ticket.FechaCierre_ticket = reporte.FechaCierre_reporte;
            ticket.Estatus_ticket = reporte.Estatus_reporte;
            ticket.ID_cuadrilla = reporte.ID_cuadrilla;
            ticket.TiempoEstimado_ticket = reporte.TiempoEstimado_reporte;
            ticket.ID_tipoReporte = reporte.ID_tipoReporte;
            return ticket;
        }

        // Entrada: string con ID de reporte y string con indicador del tipo de imagen.
        // Salida: Lista de Imagenes.
        // Descripción: Llama al método del reporsitorio de imagen para consultar las imágenes que coincidan
        // con el ID del reporte y el tipo de imagen.
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

        // Entrada: ID del reporte de tipo INT, lista de tipo Imagen y mensaje de tipo String
        // Salida: valor booleano.
        // Descripción: Llama al método del reporsitorio de imagen
        // para insertar nuevas imágenes en la base de datos.
        public bool InsertarImagenesReporte(int idReporte, List<Imagen> imagenes, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                foreach (var imagen in imagenes )
                {
                    _imagenRepository.InsertarImagen(idReporte, imagen);
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


        public List<dynamic> GetReporteJefeAsignado(int id_jefe, int idTipo, int idEstatus)
        {
            return this._reporteRepository.reportePorJefe(id_jefe, idTipo, idEstatus);
        }

        public string SendSMS(out string Message)
        {
            Message = _reporteRepository.EnviarSMS("526442513016", "Mensaje ejemplo");
            return Message;
        }

    }
}
