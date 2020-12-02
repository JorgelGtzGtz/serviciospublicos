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
        List<dynamic> GetCuadrillaList();
    }
    public class CuadrillaRepository : RepositoryBase<Cuadrilla>, ICuadrillaRepository
    {
        public CuadrillaRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }      
        
        //Obtener cuadrilla por ID
        public Cuadrilla GetCuadrilla(int id)
        {
            Sql query = new Sql()
            .Select("*").From("Cuadrilla")
            .Where("cuadrilla.ID_cuadrilla =@0 ", id);
            return this.Context.SingleOrDefault<Cuadrilla>(query); 
        }

        //Obtener todas las cuadrillas registradas y se muestra el nombre del jefe de cuadrilla
        public List<dynamic> GetCuadrillaList()
        {
            Sql query = new Sql(@"select cuadrilla.*, usuario.Nombre_usuario as jefe
                                from  [hiram74_residencias].[Cuadrilla] cuadrilla
                                inner join [hiram74_residencias].[Usuario] usuario 
                                on cuadrilla.ID_JefeCuadrilla = usuario.ID_usuario");
            return this.Context.Fetch<dynamic>(query);
        }
    }
}
