using ServiciosPublicos.Core.Data;
using PetaPoco;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Factories
{
    public interface IDbFactory : IDisposable
    {
        DataContext Init();
    }

    public class DbFactory : IDbFactory
    {
        private DataContext _context;
        private bool isDisposed;

        public Transaction _transaction { get; set; }

        ~DbFactory()
        {
            Dispose(false);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        private void Dispose(bool disposing)
        {
            var doThrowTransactionException = false;

            if (_transaction != null)
            {
                _context.AbortTransaction();
                _transaction.Dispose();
                doThrowTransactionException = true;
            }

            if (!isDisposed && disposing && _context != null)
                _context.Dispose();

            isDisposed = true;

            if (doThrowTransactionException)
                throw new DataException("Transaction was aborted");
        }

        public DataContext Init()
        {
            return _context ?? (_context = new DataContext());
        }
    }
}
