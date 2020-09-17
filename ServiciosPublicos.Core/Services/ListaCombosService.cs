using dbconnection;
using ServiciosPublicos.Core.Repository;
using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Services
{
    public interface IListaCombosService
    {
        List<TiposUsuario> GetTipoUsuarios();
    }

    public class ListaCombosService : IListaCombosService
    {
        private readonly ITipoUsuarioRepository _tipoUsuarioRepository;

        public ListaCombosService(ITipoUsuarioRepository tipoUsuarioRepository)
        {
            _tipoUsuarioRepository = tipoUsuarioRepository;
        }

        public List<TiposUsuario> GetTipoUsuarios()
        {
            Sql query = new Sql()
                .Select("*").From("TiposUsuario");
            return _tipoUsuarioRepository.GetByFilter(query);
        }


    }
}
