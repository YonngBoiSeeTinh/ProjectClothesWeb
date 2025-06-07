using WebAPI.Models;

namespace WebAPI.Factory
{
    public static class RepositoryFactory
    {
        public static IRepository<T> CreateRepository<T>(CSDLBanHang context) where T : BaseEntity
        {
            return new Repository<T>(context);
        }
    }

}
