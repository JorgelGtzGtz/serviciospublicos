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
        bool EliminarSector(Sector sector, out string Message);
        Sector GetSector(int id);
        Sector GetSectorPorNombre(string nombre);
        List<Sector> GetSectorList();
        List<Sector> FiltroSectores(string textoB, string estado);
        int ObtenerIDRegistro();
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

        // Entrada: Objeto de tipo Sector y mensaje de tipo String
        // Salida: valor booleano.
        // Descripción: Llama al método del reporsitorio que insertar el sector en la base de datos.
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

        // Entrada: Objeto de tipo Sector y mensaje de tipo string.
        // Salida: valor booleano.
        // Descripción: Llama al método del repositorio para actualizar el registro del sector en la base de datos.
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

        // Entrada: ID de sector de tipo INT
        // Salida: Objeto de tipo Sector
        // Descripción: Llama al método del repositorio para obtener el Sector
        // que coincide con el ID proporcionado.
        public Sector GetSector(int id)
        {
            return _SectorRepository.Get<int>(id);
        }

        // Entrada: nombre de sector de tipo string
        // Salida: Objeto de tipo Sector
        // Descripción: Llama al método del repositorio para obtener el Sector
        // que coincide con el nombre proporcionado.
        public Sector GetSectorPorNombre(string nombre)
        {
            return _SectorRepository.GetSectorPorNombre(nombre);
        }

        // Entrada: Ninguna.
        // Salida: Lista de tipo Sector.
        // Descripción: Llama al método del repositorio de Sector para obtener 
        // los registros de tabla sector.
        public List<Sector> GetSectorList()
        {
            return _SectorRepository.GetSectoresList();
        }

        // Entrada: string para texto de búsqueda y string para estado de sector.
        // Salida: lista de tipo dynamic con los sectores encontrados.
        // Descripción: Llama a la función que ejecuta el query para hacer búsqueda de sectores por filtros
        public List<Sector> FiltroSectores(string textoB, string estado)
        {
            return _SectorRepository.filtroDinamicoSector(textoB,estado);
        }

        // Entrada: Ninguna.
        // Salida: ID de nuevo registro de tipo INT
        // Descripción:  Llama a la función que ejecuta el query para obtener el último ID registrado y devuelve el siguiente
        // al sumarle 1
        public int ObtenerIDRegistro()
        {
            return _SectorRepository.ObtenerUltimoID() + 1;
        }

        // Entrada: Objeto de tipo Sector y mensaje de tipo string.
        // Salida: valor booleano.
        // Descripción: Efectúa eliminación lógica de sector al modificar 
        // atributo "disponible" de sector.
        public bool EliminarSector(Sector sector, out string Message)
        {
            Message = string.Empty;
            bool result = false;
                try
                {
                    sector.Disponible = false;
                    _SectorRepository.Modify(sector);
                    Message = "Sector eliminado con exito";
                    result = true;
                }
                catch (Exception ex)
                {
                    Message = "Sector no pudo ser eliminado" + ex.Message;
                }           
            return result;
        }


    }
}
