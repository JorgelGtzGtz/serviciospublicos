using ServiciosPublicos.Core.Data;
using ServiciosPublicos.Core.Factories;
using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiciosPublicos.Core.Repository
{
    public interface IRepositoryBase<TEntity>
    {
        IEnumerable<TEntity> GetAll(string TableName);
        List<TEntity> GetByFilter(Sql sql);
        TEntity Get<TKey>(TKey id);
        TEntity Get(Sql sql);
        TKey Exist<TKey>(string TableName, string param, string value);
        TKey Add<TKey>(TEntity entity);
        void Modify(TEntity entity);
        void Remove(TEntity entity);
        TKey InsertOrUpdate<TKey>(TEntity entity);
        void BeginTransaction();
        void CommitTransaction();
        void RollBackTransaction();
    }

    public class RepositoryBase<TEntity> : IRepositoryBase<TEntity>
    {
        protected DataContext _context;
        public DataContext Context { get { return _context ?? (_context = DbFactory.Init()); } }

        protected IDbFactory DbFactory { get; set; }

        public RepositoryBase(IDbFactory dbFactory)
        {
            DbFactory = dbFactory;
        }

        public TKey Add<TKey>(TEntity entity)
        {
            return (TKey)Context.Insert(entity);
        }

        public TEntity Get<TKey>(TKey id)
        {
            return Context.SingleOrDefault<TEntity>(id);
        }

        public TEntity Get(Sql sql)
        {
            return Context.SingleOrDefault<TEntity>(sql);
        }

        public TKey Exist<TKey>(string TableName, string param, string value)
        {
            var sql = string.Format("SELECT count(1) FROM {0} where {1} = '{2}'", TableName, param, value);
            return Context.SingleOrDefault<TKey>(sql);
        }

        public IEnumerable<TEntity> GetAll(string TableName)
        {
            var sql = string.Format("SELECT * FROM {0}", TableName);
            return Context.Query<TEntity>(sql);
        }

        public List<TEntity> GetByFilter(Sql sql)
        {
            return Context.Fetch<TEntity>(sql);
        }

        public TKey InsertOrUpdate<TKey>(TEntity entity)
        {
            //var pd = PocoData.ForType(typeof(TEntity), Context.DefaultMapper);
            //var primaryKey = pd.TableInfo.PrimaryKey;

            var id = entity.GetType().GetProperty("ID").GetValue(entity, null);
            var exists = Context.SingleOrDefault<TEntity>(id);

            if (!EqualityComparer<TEntity>.Default.Equals(exists, default(TEntity)))
            {
                Context.Update(entity);
                return (TKey)id;
            }

            return (TKey)Context.Insert(entity);
        }

        public void Modify(TEntity entity)
        {
            Context.Update(entity);
        }

        public void Remove(TEntity entity)
        {
            Context.Delete(entity);
        }

        public void BeginTransaction()
        {
            Context.BeginTransaction();
        }

        public void CommitTransaction()
        {
            Context.CompleteTransaction();
        }

        public void RollBackTransaction()
        {
            Context.AbortTransaction();
        }
    }
}
