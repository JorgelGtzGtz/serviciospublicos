﻿using dbServiciosPublicos;
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
        List<dynamic> GetReportesFiltro(string tipoR, string cuadrilla, string estado, string sector, string origen, string fechaIni, string fechaF);
        List<dynamic> GetReporteFiltroCuadrilla(string idCuadrilla);
        List<Imagen> GetImagenesReporte(string idReporte, string tipoImagen, out string Message);
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

        // Entrada: valores de tipo string que funcionan como filtros para la búsqueda de registros.
        // Salida: lista de tipo dynamic con los registros de reportes.
        // Descripción: Método para ejecutar el query que realiza una búsqueda dinámica de reportes
        // de acuerdo a los diversos filtros que se indican.
        public List<dynamic> GetReportesFiltro(string tipoR, string cuadrilla, string estado, string sector, string origen, string fechaIni, string fechaF)
        {           
            return this._reporteRepository.GetReportesFiltroDinamico(tipoR,cuadrilla,estado,sector,origen,fechaIni,fechaF);
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
                int idReporte = reporte.ID_reporte;
                _reporteRepository.Modify(reporte);
                var listaReporTicket = _reporteTicketRepository.GetReporteTickets(idReporte);
                foreach (var reporteTicket in listaReporTicket)
                {
                    int idTicket = reporteTicket.ID_ticket;
                    Ticket ticket = _ticketRepository.GetTicket(idTicket);
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
            ticket.FechaCierre_ticket = reporte.FechaCierre_reporte;
            ticket.Estatus_ticket = reporte.Estatus_reporte;
            ticket.ID_cuadrilla = reporte.ID_cuadrilla;
            ticket.TiempoEstimado_ticket = reporte.TiempoEstimado_reporte;
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

    }
}
