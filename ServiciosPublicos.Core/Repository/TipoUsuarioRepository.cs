using dbServiciosPublicos;
using PetaPoco;
using ServiciosPublicos.Core.Factories;
using System.Collections.Generic;

namespace ServiciosPublicos.Core.Repository
{
    
    public interface ITipoUsuarioRepository : IRepositoryBase<Tipo_usuario>
    {
        Tipo_usuario GetTipo(string nombre);
        List<dynamic> GetTipoUsuariosFiltroDinamico(string textoBusqueda = null, string estado = null);
        List<Tipo_usuario> GetTipoUsuarioGeneral();
        int ObtenerUltimoID();
    }

    public class TipoUsuarioRepository : RepositoryBase<Tipo_usuario>, ITipoUsuarioRepository
    {
        public TipoUsuarioRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        // Entrada: valor string con la descripción del tipo de usuario
        // Salida: Tipo de usuario.
        // Descripción: Query para encontrar tipo de usuario que coincida con la descripción.
        public Tipo_usuario GetTipo( string nombre)
        {
            Sql query = new Sql(@"SELECT * FROM Tipo_usuario WHERE
                                    Descripcion_tipoUsuario = @0 AND Disponible = 1",nombre);
            return this.Context.SingleOrDefault<Tipo_usuario>(query);

        }


        // Entrada: valor string con la descripción del tipo de usuario
        // Salida: Tipo de usuario.
        // Descripción: Query para encontrar tipo de usuario que coincida con la descripción.
        public List<Tipo_usuario> GetTipoUsuarioGeneral()
        {
            Sql query = new Sql()
                .Select("*")
                .From("Tipo_usuario")
                .Where("Disponible = 1");
            return this.Context.Fetch<Tipo_usuario>(query);

        }


        // Entrada: valor string para ID o descripción de tipo de usuario, y valor string de estado.
        // Salida: Lista de tipos de usuario que cumplieron con los filtros.
        // Descripción: Query para encontrar los tipos de usuario que coincidan con los filtros enviados.
        public List<dynamic> GetTipoUsuariosFiltroDinamico(string textoBusqueda = null, string estado = null)
        {
            string filter = " WHERE ";
            bool operacion = false;
            filter += "Disponible = 1 ";
            if (!string.IsNullOrEmpty(textoBusqueda))
            {
                filter += string.Format(" AND (ID_tipoUsuario LIKE '%{0}%' OR " +
                                        "Descripcion_tipoUsuario LIKE '%{0}%')", textoBusqueda);
                operacion = true;
            }

            if (!string.IsNullOrEmpty(estado))
            {
                filter += string.Format(" AND Estatus_tipoUsuario LIKE '%{0}%'", estado);
                operacion = true;
            }

            Sql query = new Sql(@"SELECT * FROM Tipo_usuario " + filter );
            return this.Context.Fetch<dynamic>(query);
        }

        // Entrada: Ninguna.
        // Salida: valor int con el último ID.
        // Descripción: Query para encontrar el último ID registrado en la base de datos.
        public int ObtenerUltimoID()
        {
            Sql query = new Sql(@"SELECT IDENT_CURRENT('Tipo_usuario')");
            return this.Context.SingleOrDefault<int>(query);
        }

    }
    
}
