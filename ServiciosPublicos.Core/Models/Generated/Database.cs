
// This file was automatically generated by the PetaPoco T4 Template
// Do not make changes directly to this file - edit the template instead
// 
// The following connection settings were used to generate this file
// 
//     Connection String Name: `dbServiciosPublicos`
//     Provider:               `System.Data.SqlClient`
//     Connection String:      `Data Source=198.38.83.33;Initial Catalog=hiram74_serviciospublicos;Integrated Security=false;user ID=hiram74_residencias;password=**zapped**;Connection Timeout=0`
//     Schema:                 ``
//     Include Views:          `False`

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PetaPoco;

namespace dbServiciosPublicos
{
	public partial class dbServiciosPublicosDB : Database
	{
		public dbServiciosPublicosDB() 
			: base("dbServiciosPublicos")
		{
			CommonConstruct();
		}

		public dbServiciosPublicosDB(string connectionStringName) 
			: base(connectionStringName)
		{
			CommonConstruct();
		}
		
		partial void CommonConstruct();
		
		public interface IFactory
		{
			dbServiciosPublicosDB GetInstance();
		}
		
		public static IFactory Factory { get; set; }
        public static dbServiciosPublicosDB GetInstance()
        {
			if (_instance!=null)
				return _instance;
				
			if (Factory!=null)
				return Factory.GetInstance();
			else
				return new dbServiciosPublicosDB();
        }

		[ThreadStatic] static dbServiciosPublicosDB _instance;
		
		public override void OnBeginTransaction()
		{
			if (_instance==null)
				_instance=this;
		}
		
		public override void OnEndTransaction()
		{
			if (_instance==this)
				_instance=null;
		}
        
		public class Record<T> where T:new()
		{
			public static dbServiciosPublicosDB repo { get { return dbServiciosPublicosDB.GetInstance(); } }
			public bool IsNew() { return repo.IsNew(this); }
			public object Insert() { return repo.Insert(this); }
			public void Save() { repo.Save(this); }
			public int Update() { return repo.Update(this); }
			public int Update(IEnumerable<string> columns) { return repo.Update(this, columns); }
			public static int Update(string sql, params object[] args) { return repo.Update<T>(sql, args); }
			public static int Update(Sql sql) { return repo.Update<T>(sql); }
			public int Delete() { return repo.Delete(this); }
			public static int Delete(string sql, params object[] args) { return repo.Delete<T>(sql, args); }
			public static int Delete(Sql sql) { return repo.Delete<T>(sql); }
			public static int Delete(object primaryKey) { return repo.Delete<T>(primaryKey); }
			public static bool Exists(object primaryKey) { return repo.Exists<T>(primaryKey); }
			public static bool Exists(string sql, params object[] args) { return repo.Exists<T>(sql, args); }
			public static T SingleOrDefault(object primaryKey) { return repo.SingleOrDefault<T>(primaryKey); }
			public static T SingleOrDefault(string sql, params object[] args) { return repo.SingleOrDefault<T>(sql, args); }
			public static T SingleOrDefault(Sql sql) { return repo.SingleOrDefault<T>(sql); }
			public static T FirstOrDefault(string sql, params object[] args) { return repo.FirstOrDefault<T>(sql, args); }
			public static T FirstOrDefault(Sql sql) { return repo.FirstOrDefault<T>(sql); }
			public static T Single(object primaryKey) { return repo.Single<T>(primaryKey); }
			public static T Single(string sql, params object[] args) { return repo.Single<T>(sql, args); }
			public static T Single(Sql sql) { return repo.Single<T>(sql); }
			public static T First(string sql, params object[] args) { return repo.First<T>(sql, args); }
			public static T First(Sql sql) { return repo.First<T>(sql); }
			public static List<T> Fetch(string sql, params object[] args) { return repo.Fetch<T>(sql, args); }
			public static List<T> Fetch(Sql sql) { return repo.Fetch<T>(sql); }
			public static List<T> Fetch(long page, long itemsPerPage, string sql, params object[] args) { return repo.Fetch<T>(page, itemsPerPage, sql, args); }
			public static List<T> Fetch(long page, long itemsPerPage, Sql sql) { return repo.Fetch<T>(page, itemsPerPage, sql); }
			public static List<T> SkipTake(long skip, long take, string sql, params object[] args) { return repo.SkipTake<T>(skip, take, sql, args); }
			public static List<T> SkipTake(long skip, long take, Sql sql) { return repo.SkipTake<T>(skip, take, sql); }
			public static Page<T> Page(long page, long itemsPerPage, string sql, params object[] args) { return repo.Page<T>(page, itemsPerPage, sql, args); }
			public static Page<T> Page(long page, long itemsPerPage, Sql sql) { return repo.Page<T>(page, itemsPerPage, sql); }
			public static IEnumerable<T> Query(string sql, params object[] args) { return repo.Query<T>(sql, args); }
			public static IEnumerable<T> Query(Sql sql) { return repo.Query<T>(sql); }
		}
	}
	

    
	[TableName("hiram74_residencias.Cuadrilla")]
	[PrimaryKey("ID_cuadrilla")]
	[ExplicitColumns]
    public partial class Cuadrilla : dbServiciosPublicosDB.Record<Cuadrilla>  
    {
		[Column] public int ID_cuadrilla { get; set; }
		[Column] public string Nombre_cuadrilla { get; set; }
		[Column] public bool Estatus_cuadrilla { get; set; }
		[Column] public int Tipo_cuadrilla { get; set; }
		[Column] public int ID_JefeCuadrilla { get; set; }
	}
    
	[TableName("hiram74_residencias.Imagen")]
	[PrimaryKey("ID_imagen")]
	[ExplicitColumns]
    public partial class Imagen : dbServiciosPublicosDB.Record<Imagen>  
    {
		[Column] public int ID_imagen { get; set; }
		[Column] public string Path_imagen { get; set; }
		[Column] public int ID_reporte { get; set; }
		[Column] public int ID_ticket { get; set; }
		[Column] public int Tipo_imagen { get; set; }
	}
    
	[TableName("hiram74_residencias.Permisos")]
	[PrimaryKey("ID_permiso")]
	[ExplicitColumns]
    public partial class Permiso : dbServiciosPublicosDB.Record<Permiso>  
    {
		[Column] public int ID_permiso { get; set; }
		[Column] public int ID_tipoUsuario { get; set; }
		[Column] public int ID_procesoPermisos { get; set; }
	}
    
	[TableName("hiram74_residencias.Procesos_Permisos")]
	[PrimaryKey("ID_ProcesosPermiso")]
	[ExplicitColumns]
    public partial class Procesos_Permiso : dbServiciosPublicosDB.Record<Procesos_Permiso>  
    {
		[Column] public int ID_ProcesosPermiso { get; set; }
		[Column] public string Descripcion_ProcesoPermiso { get; set; }
	}
    
	[TableName("hiram74_residencias.Reporte")]
	[PrimaryKey("ID_reporte")]
	[ExplicitColumns]
    public partial class Reporte : dbServiciosPublicosDB.Record<Reporte>  
    {
		[Column] public int ID_reporte { get; set; }
		[Column] public double? Latitud_reporte { get; set; }
		[Column] public double? Longitud_reporte { get; set; }
		[Column] public DateTime FechaRegistro_reporte { get; set; }
		[Column] public DateTime? FechaCierre_reporte { get; set; }
		[Column] public int NoTickets_reporte { get; set; }
		[Column] public int Estatus_reporte { get; set; }
		[Column] public int ID_sector { get; set; }
		[Column] public int? ID_cuadrilla { get; set; }
		[Column] public int? TiempoEstimado_reporte { get; set; }
		[Column] public int? TiempoRestante_reporte { get; set; }
		[Column] public string Direccion_reporte { get; set; }
		[Column] public string EntreCalles_reporte { get; set; }
		[Column] public string Referencia_reporte { get; set; }
		[Column] public string Colonia_reporte { get; set; }
		[Column] public string Poblado_reporte { get; set; }
		[Column] public string Observaciones_reporte { get; set; }
		[Column] public int Origen { get; set; }
	}
    
	[TableName("hiram74_residencias.Reporte_Ticket")]
	[PrimaryKey("Folio_RepTicket")]
	[ExplicitColumns]
    public partial class Reporte_Ticket : dbServiciosPublicosDB.Record<Reporte_Ticket>  
    {
		[Column] public int Folio_RepTicket { get; set; }
		[Column] public int ID_reporte { get; set; }
		[Column] public int ID_ticket { get; set; }
	}
    
	[TableName("hiram74_residencias.Sector")]
	[PrimaryKey("ID_sector")]
	[ExplicitColumns]
    public partial class Sector : dbServiciosPublicosDB.Record<Sector>  
    {
		[Column] public int ID_sector { get; set; }
		[Column] public string Descripcion_sector { get; set; }
		[Column] public bool Estatus_sector { get; set; }
	}
    
	[TableName("hiram74_residencias.Ticket")]
	[PrimaryKey("ID_ticket")]
	[ExplicitColumns]
    public partial class Ticket : dbServiciosPublicosDB.Record<Ticket>  
    {
		[Column] public int ID_ticket { get; set; }
		[Column] public int ID_tipoReporte { get; set; }
		[Column] public int ID_usuarioReportante { get; set; }
		[Column] public int Estatus_ticket { get; set; }
		[Column] public DateTime FechaRegistro_ticket { get; set; }
		[Column] public DateTime? FechaCierre_ticket { get; set; }
		[Column] public double? Latitud_ticket { get; set; }
		[Column] public double? Longitud_ticket { get; set; }
		[Column] public int ID_sector { get; set; }
		[Column] public int? ID_cuadrilla { get; set; }
		[Column] public double? TiempoEstimado_ticket { get; set; }
		[Column] public string Direccion_ticket { get; set; }
		[Column] public string EntreCalles_ticket { get; set; }
		[Column] public string Referencia_ticket { get; set; }
		[Column] public string Colonia_ticket { get; set; }
		[Column] public string Poblacion_ticket { get; set; }
		[Column] public bool? EnviarCorreo_ticket { get; set; }
		[Column] public bool? EnviarSMS_ticket { get; set; }
		[Column] public string Observaciones_ticket { get; set; }
		[Column] public int Origen { get; set; }
	}
    
	[TableName("hiram74_residencias.Tipo_Reporte")]
	[PrimaryKey("ID_tipoReporte")]
	[ExplicitColumns]
    public partial class Tipo_Reporte : dbServiciosPublicosDB.Record<Tipo_Reporte>  
    {
		[Column] public int ID_tipoReporte { get; set; }
		[Column] public string Descripcion_tipoReporte { get; set; }
	}
    
	[TableName("hiram74_residencias.Tipo_usuario")]
	[PrimaryKey("ID_tipoUsuario")]
	[ExplicitColumns]
    public partial class Tipo_usuario : dbServiciosPublicosDB.Record<Tipo_usuario>  
    {
		[Column] public int ID_tipoUsuario { get; set; }
		[Column] public string Descripcion_tipoUsuario { get; set; }
		[Column] public bool Estatus_tipoUsuario { get; set; }
	}
    
	[TableName("hiram74_residencias.Usuario")]
	[PrimaryKey("ID_usuario")]
	[ExplicitColumns]
    public partial class Usuario : dbServiciosPublicosDB.Record<Usuario>  
    {
		[Column] public int ID_usuario { get; set; }
		[Column] public string Nombre_usuario { get; set; }
		[Column] public string Correo_usuario { get; set; }
		[Column] public string Telefono_usuario { get; set; }
		[Column] public string Genero_usuario { get; set; }
		[Column] public int ID_tipoUsuario { get; set; }
		[Column] public string Login_usuario { get; set; }
		[Column] public string Password_usuario { get; set; }
		[Column] public bool Estatus_usuario { get; set; }
		[Column] public bool Jefe_asignado { get; set; }
	}
}
