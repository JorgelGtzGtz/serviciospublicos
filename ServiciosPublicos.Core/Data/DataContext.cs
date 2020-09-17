using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Data
{
    public class DataContext : Database
    {
        public DataContext() : base("dbconnection")
        {
        }

        public DataContext(string connectionStringOrName) : base(connectionStringOrName)
        {
        }

    }
}
