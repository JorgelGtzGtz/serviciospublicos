using dbServiciosPublicos;
using PetaPoco;
using ServiciosPublicos.Core.Factories;
using System.Collections.Generic;

namespace ServiciosPublicos.Core.Repository
{
    
    public interface ITipoUsuarioRepository : IRepositoryBase<Tipo_usuario>
    {
        Tipo_usuario GetTipo(string nombre);
        List<dynamic> GetUsuariosFiltroGeneral(string textoBusqueda = null, string estado = null);
    }

    public class TipoUsuarioRepository : RepositoryBase<Tipo_usuario>, ITipoUsuarioRepository
    {
        public TipoUsuarioRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        public Tipo_usuario GetTipo( string nombre)
        {
            Sql query = new Sql(@"SELECT * FROM Tipo_usuario WHERE
                                    Descripcion_tipoUsuario = @0",nombre);
            return this.Context.SingleOrDefault<Tipo_usuario>(query);

        }


        public List<dynamic> GetUsuariosFiltroGeneral(string textoBusqueda = null, string estado = null)
        {
            string filter = " Where ";
            bool operacion = false;

            if (!string.IsNullOrEmpty(textoBusqueda))
            {
                filter += string.Format("(ID_tipoUsuario LIKE '%{0}%' OR " +
                                        "Descripcion_tipoUsuario LIKE '%{0}%')", textoBusqueda);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(estado))
            {
                filter += (operacion ? " AND ": "") +  string.Format("Estatus_tipoUsuario LIKE '%{0}%'", estado);
                operacion = true;
            }

            Sql query = new Sql(@"SELECT * FROM Tipo_usuario " + (operacion ? filter : ""));
            return this.Context.Fetch<dynamic>(query);
        }

    }
    
}
