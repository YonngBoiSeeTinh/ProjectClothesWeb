namespace WebAPI.Factory
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task AddAsync(T entity, IFormFile? image = null);
        Task UpdateAsync(T entity, IFormFile? image = null);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }

}
