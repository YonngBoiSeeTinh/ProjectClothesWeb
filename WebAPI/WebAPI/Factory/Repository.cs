using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Factory
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        private readonly CSDLBanHang _context;
        private readonly DbSet<T> _dbSet;

        public Repository(CSDLBanHang context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
                throw new KeyNotFoundException($"Không tìm thấy {typeof(T).Name} với ID {id}");
            return entity;
        }

        public async Task AddAsync(T entity, IFormFile? image = null)
        {
            try
            {

                // Kiểm tra nếu entity có ảnh
                if (entity is IHasImage entityWithImage && image != null)
                {
                    using var memoryStream = new MemoryStream();
                    await image.CopyToAsync(memoryStream);
                    entityWithImage.Image = memoryStream.ToArray();
                }

                await _dbSet.AddAsync(entity);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Lỗi khi thêm {typeof(T).Name}: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        public async Task UpdateAsync(T entity, IFormFile? image = null)
        {
            var existingEntity = await _dbSet.FindAsync(entity.Id);
            if (existingEntity == null)
                throw new KeyNotFoundException($"Không tìm thấy {typeof(T).Name} với ID {entity.Id}");

            var originalCreatedAt = existingEntity.CreatedAt;
            try
            {

                if (entity is IHasImage entityWithImage)
                {
                    if (image != null)
                    {
                        using var memoryStream = new MemoryStream();
                        await image.CopyToAsync(memoryStream);
                        entityWithImage.Image = memoryStream.ToArray();
                    }
                    else
                    {
                        // Giữ nguyên ảnh cũ trước khi cập nhật
                        entityWithImage.Image = ((IHasImage)existingEntity).Image;
                    }
                }

                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                entity.UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vietnamTimeZone);

                _context.Entry(existingEntity).CurrentValues.SetValues(entity);
                entity.CreatedAt = originalCreatedAt;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new DbUpdateConcurrencyException($"Dữ liệu đã bị thay đổi bởi một task khác.");
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Lỗi khi cập nhật {typeof(T).Name}: {ex.Message}");
            }
        }


        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _dbSet.FindAsync(id) != null;
        }
    }


}
