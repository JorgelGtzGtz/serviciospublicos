using Autofac;
using Autofac.Core;
using Autofac.Integration.WebApi;
using ServiciosPublicos.Core.Factories;
using ServiciosPublicos.Core.Repository;
using ServiciosPublicos.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;

namespace ServiciosPublicos.Api.App_Start
{
    public class AutofacConfig
    {

        public static IContainer Container;
        public static void Initialize(HttpConfiguration config)
        {
            Initialize(config, RegisterServices(new ContainerBuilder()));
        }

        public static void Initialize(HttpConfiguration config, IContainer container)
        {
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        private static IContainer RegisterServices(ContainerBuilder builder)
        {
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            builder.RegisterType<DbFactory>().As<IDbFactory>().AsImplementedInterfaces();
           /* builder.RegisterType<AccesosRepository>().As<IAccesosRepository>().AsImplementedInterfaces();
            builder.RegisterType<AccesosTipoUsuarioRepository>().As<IAccesosTipoUsuarioRepository>().AsImplementedInterfaces();
           */
            //REPOSITORIOS          
            builder.RegisterType<UsuarioRepository>().As<IUsuarioRepository>().AsImplementedInterfaces();
            builder.RegisterType<TicketRepository>().As<ITicketRepository>().AsImplementedInterfaces();
            builder.RegisterType<TipoUsuarioRepository>().As<ITipoUsuarioRepository>().AsImplementedInterfaces();
            builder.RegisterType<PermisosRepository>().As<IPermisosRepository>().AsImplementedInterfaces();
            builder.RegisterType<ProcesosPermisosRepository>().As<IProcesosPermisosRepository>().AsImplementedInterfaces();
            builder.RegisterType<ReporteTicketRepository>().As<IReporteTicketRepository>().AsImplementedInterfaces();
            builder.RegisterType<ReporteRepository>().As<IReporteRepository>().AsImplementedInterfaces();
            builder.RegisterType<TipoReporteRepository>().As<ITipoReporteRepository>().AsImplementedInterfaces();
            builder.RegisterType<ImagenRepository>().As<IImagenRepository>().AsImplementedInterfaces();
            builder.RegisterType<SectorRepository>().As<ISectorRepository>().AsImplementedInterfaces();
            builder.RegisterType<CuadrillaRepository>().As<ICuadrillaRepository>().AsImplementedInterfaces();


            //SERVICIOS
            builder.RegisterType<PermisosService>().As<IPermisosService>().AsImplementedInterfaces();
            builder.RegisterType<ListaCombosService>().As<IListaCombosService>().AsImplementedInterfaces();
            builder.RegisterType<TipoUsuarioService>().As<ITipoUsuarioService>().AsImplementedInterfaces();            
            builder.RegisterType<UsuarioService>().As<IUsuarioService>().AsImplementedInterfaces();
            builder.RegisterType<TicketService>().As<ITicketService>().AsImplementedInterfaces();
            builder.RegisterType<ProcesosPermisosService>().As<IProcesosPermisosService>().AsImplementedInterfaces();
            builder.RegisterType<ReporteTicketService>().As<IReporteTicketService>().AsImplementedInterfaces();
            builder.RegisterType<ReporteServicio>().As<IReporteServicio>().AsImplementedInterfaces();
            builder.RegisterType<TipoReporteService>().As<ITipoReporteService>().AsImplementedInterfaces();
            builder.RegisterType<ImagenService>().As<IImagenService>().AsImplementedInterfaces();
            builder.RegisterType<SectorService>().As<ISectorService>().AsImplementedInterfaces();
            builder.RegisterType<CuadrillaService>().As<ICuadrillaService>().AsImplementedInterfaces();


            Container = builder.Build();

            return Container;
        }

        public static T Resolve<T>()
        {
            if (Container == null)
            {
                throw new Exception("AutofacConfig hasn't been Initialize!");
            }

            return Container.Resolve<T>(new Parameter[0]);
        }
    }
}