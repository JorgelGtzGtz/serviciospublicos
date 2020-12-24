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
        Permiso GetPermisoTipoUsuario(int idTipo, int idProcesoPermiso);
    }

    public class PermisosRepository : RepositoryBase<Permiso>, IPermisosRepository
    {
        public PermisosRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        // Entrada: Valor int del ID del tipo de usuario
        // Salida: Lista de tipo Permiso.
        // Descripción:Recibe ya sea la descripcion del tipo de usuario o el id
        //y ejecuta el query para buscar los permisos de ese tipo de usuario
        public List<Permiso> GetPermisosTipoUsuario(int idTipo)
        {
            Sql query = new Sql()
                .Select('*').From("hiram74_residencias.Permisos").Where("ID_tipoUsuario = @0", idTipo);

            var permisosTipoUsuario = this.Context.Fetch<Permiso>(query);
            return permisosTipoUsuario;
        }

        //Entrada: valor int del ID del tipo de usuario y valor int del ID del Permiso
        //Salida: Valor de tipo Permiso o null
        //Descripción: Ejecuta query para consultar si el permiso ya se encuentra relacionado con un tipo
        // de usuario. Regresa el permiso encontrado o null.
        public Permiso GetPermisoTipoUsuario(int idTipo, int idProcesoPermiso)
        {
            Sql query = new Sql()
                    .Select("*").From("Permisos")
                    .Where("ID_tipoUsuario = @0 and ID_procesoPermisos = @1", idTipo, idProcesoPermiso);
            return this.Context.SingleOrDefault<Permiso>(query);
        }


       



    }
}
