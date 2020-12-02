using dbServiciosPublicos;
using PetaPoco;
using ServiciosPublicos.Core.Entities;
using ServiciosPublicos.Core.Factories;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Repository
{
    public interface IPermisosRepository : IRepositoryBase<Permiso>
    {
        List<Permiso> GetPermisosTipoUsuario(int idTipo);
    }

    public class PermisosRepository : RepositoryBase<Permiso>, IPermisosRepository
    {
        public PermisosRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        //Recibe ya sea la descripcion del tipo de usuario o el id
        //devuelve los permisos de ese tipo de usuario

        public List<Permiso> GetPermisosTipoUsuario(int idTipo)
        {
            Sql query = new Sql()
                .Select('*').From("hiram74_residencias.Permisos").Where("ID_tipoUsuario = @0", idTipo);

            var permisosTipoUsuario = this.Context.Fetch<Permiso>(query);
            return permisosTipoUsuario;
        }


        /*public List<dynamic> GetPermisosTipoUsuario(string tipoUsuario = null)
        {
            string filter = " Where ";

            if (!string.IsNullOrEmpty(tipoUsuario))
            {
                filter += string.Format("tipoUsuario.ID_tipoUsuario like '%{0}%' " +
                    "OR tipoUsuario.Descripcion_tipoUsuario like '%{0}%'", tipoUsuario);

            }

            Sql query = new Sql(@"SELECT permisos.ID_permiso,permisos.ID_procesoPermisos, 
                                proceso.Descripcion_ProcesoPermiso AS procesoPermiso 
                                FROM [hiram74_residencias].[Permisos] permisos
                                INNER JOIN [hiram74_residencias].[Procesos_Permisos] proceso
                                ON proceso.ID_ProcesosPermiso = permisos.ID_procesoPermisos
                                INNER JOIN [hiram74_residencias].[Tipo_usuario] tipoUsuario 
                                ON tipoUsuario.ID_tipoUsuario = permisos.ID_tipoUsuario" + 
                                (!string.IsNullOrEmpty(tipoUsuario) ? filter : ""));
            
            var permisosTipoUsuario = this.Context.Fetch<dynamic>(query);
            return permisosTipoUsuario;
        }
        */



    }
}
