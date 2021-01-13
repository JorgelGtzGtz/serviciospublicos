using dbServiciosPublicos;
using PetaPoco;
using ServiciosPublicos.Core.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Repository
{
    public interface ICuadrillaRepository : IRepositoryBase<Cuadrilla>
    {
        Cuadrilla GetCuadrilla(int id);
        Cuadrilla GetCuadrillaPorNombre(string nombre);
        List<dynamic> GetCuadrillasConJefeQuery();
        List<dynamic> FiltroDinamicoCuadrillas(string textoB, string estado);
        int ObtenerUltimoID();
    }
    public class CuadrillaRepository : RepositoryBase<Cuadrilla>, ICuadrillaRepository
    {
        public CuadrillaRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        // Entrada: valor INT de ID de cuadrilla.
        // Salida: Objeto de tipo Cuadrilla.
        // Descripción:Query para obtener cuadrilla por ID
        public Cuadrilla GetCuadrilla(int id)
        {
            Sql query = new Sql()
            .Select("*").From("Cuadrilla")
            .Where("cuadrilla.ID_cuadrilla =@0 ", id);
            return this.Context.SingleOrDefault<Cuadrilla>(query); 
        }

        // Entrada: valor string de nombre de cuadrilla.
        // Salida: Objeto de tipo Cuadrilla.
        // Descripción:Query para obtener cuadrilla por nombre
        public Cuadrilla GetCuadrillaPorNombre(string nombre)
        {
            Sql query = new Sql(@"SELECT * FROM Cuadrilla 
                                WHERE Nombre_cuadrilla = @0 AND Disponible = 1", nombre);
            
            return this.Context.SingleOrDefault<Cuadrilla>(query);
        }

        // Entrada: Ninguna.
        // Salida: lista de tipo dynamic con los registros de cuadrillas.
        // Descripción:Query para obtener todas las cuadrillas registradas con el nombre del jefe de cuadrilla
        public List<dynamic> GetCuadrillasConJefeQuery()
        {
            Sql query = new Sql(@"select cuadrilla.*, usuario.Nombre_usuario as jefe
                                from  [hiram74_residencias].[Cuadrilla] cuadrilla
                                inner join [hiram74_residencias].[Usuario] usuario 
                                on cuadrilla.ID_JefeCuadrilla = usuario.ID_usuario");
            return this.Context.Fetch<dynamic>(query);
        }

        // Entrada: valor string para texto de búsqueda y valor string para estado de cuadrilla.
        // Salida: lista de tipo dynamic con los registros de cuadrillas.
        // Descripción:Query para búsqueda de cuadrillas con sus respectivos jefes, de acuerdo a determinados filtros
        public List<dynamic> FiltroDinamicoCuadrillas(string textoB, string estado)
        {
            string filter = " WHERE ";
            bool operacion = false;

            filter += "cuadrilla.Disponible = 1 ";
            if (!string.IsNullOrEmpty(textoB))
            {
                filter += string.Format(" AND cuadrilla.Nombre_cuadrilla LIKE '%{0}%' OR " +
                                        "cuadrilla.ID_cuadrilla LIKE '%{0}%' OR " +
                                        "usuario.Nombre_usuario LIKE '%{0}%'", textoB);
                operacion = true;
            }

            if (! string.IsNullOrEmpty(estado))
            {
                filter += string.Format(" AND cuadrilla.Estatus_cuadrilla LIKE '%{0}%'", estado);
                operacion = true;
            }

            Sql query = new Sql(@"SELECT cuadrilla.*, usuario.Nombre_usuario AS jefe
                                FROM [hiram74_residencias].[Cuadrilla] cuadrilla
                                INNER JOIN [hiram74_residencias].[Usuario] usuario 
                                ON usuario.ID_usuario = cuadrilla.ID_JefeCuadrilla " + filter);
            return this.Context.Fetch<dynamic>(query);
        }

        // Entrada: Ninguna.
        // Salida: valor INT.
        // Descripción: Query para obtener último ID registrado en tabla de la base de datos.
        public int ObtenerUltimoID()
        {
            Sql query = new Sql(@"SELECT IDENT_CURRENT('Cuadrilla')");
            return this.Context.SingleOrDefault<int>(query);
        }
    }
}
