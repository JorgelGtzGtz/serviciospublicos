using dbServiciosPublicos;
using ServiciosPublicos.Core.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Services
{
    public interface ISectorService
    {
        bool InsertSector(Sector sector, out string Message);
        bool UpdateSector(Sector sector, out string Message);
        bool EliminarSector(int id, out string Message);
        Sector GetSector(int id);
        List<Sector> GetSectorList();
    }
    public class SectorService: ISectorService
    {
        private readonly ISectorRepository _SectorRepository;
        private readonly IReporteRepository _reporteRepository;
        private readonly ITicketRepository _ticketReporsitory;

        public SectorService(ISectorRepository sectorRepository, IReporteRepository reporteRepository, ITicketRepository ticketRepository  )
        {
            _SectorRepository = sectorRepository;
            _reporteRepository = reporteRepository;
            _ticketReporsitory = ticketRepository;
        }

        //Insertar nuevo sector
        public bool InsertSector(Sector sector, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                _SectorRepository.Add<int>(sector);
                Message = "Sector registrado con exito";
                result = true;
            }
            catch(Exception ex)
            {
                Message = "Sector no pudo ser registrado" + ex.Message;
            }
            
            return result;

        }

        //Actualizar sector
        public bool UpdateSector(Sector sector, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            try
            {
                _SectorRepository.Modify(sector);
                Message = "Sector "+sector.Descripcion_sector+ " actualizado con exito";
                result = true;
            }
            catch (Exception ex)
            {
                Message = "Sector " + sector.Descripcion_sector + " no pudo ser actualizado" + ex.Message;
            }
            return result;
        }

        //Consultar un Sector por ID
        public Sector GetSector(int id)
        {
            return _SectorRepository.Get<int>(id);
        }

        //Consultar los sectores existentes
        public List<Sector> GetSectorList()
        {
            return _SectorRepository.GetAll("Sector").ToList();
        }

        //Eliminar un sector
        public bool EliminarSector(int id, out string Message)
        {
            Message = string.Empty;
            bool result = false;
            Sector sector = _SectorRepository.Get<int>(id);
            //Verificar si se hace referencia al sector en un registro
            // de ticket (por ende, estará en reportes)
            var ticket = _ticketReporsitory.GetSectoresTicket(id);
            if (ticket.Count == 0)
            {
                try
                {
                    _SectorRepository.Remove(sector);
                    Message = "Sector eliminado con exito";
                    result = true;
                }
                catch (Exception ex)
                {
                    Message = "Sector no pudo ser eliminado" + ex.Message;
                }
            }
            else
            {
                Message = "Sector no pudo ser eliminado porque se " +
                            "hace referencia a este en registros";
            }           
            return result;
        }


    }
}
