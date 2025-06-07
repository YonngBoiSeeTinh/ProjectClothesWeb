using WebAPI.Models;
using Microsoft.EntityFrameworkCore;


namespace WebAPI.Services
{
    public class CategoriesService
    {
        private readonly CSDLBanHang _context;
        private readonly ProductService _ProductService;

        public CategoriesService(CSDLBanHang context, ProductService ProductService)
        {
            _context = context;
            _ProductService = ProductService;
        }
        public async Task DeleteDependencieAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return;

            var productIds = await _context.Products
                .Where(p => p.CategoryId == id)
                .Select(p => p.Id)
                .ToListAsync();

            // Xóa tất cả sản phẩm cùng lúc
            if (productIds.Any()) {
                await Task.WhenAll(productIds.Select(proId => _ProductService.DeleteDependencieAsync(proId)));
            }
          

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }

    }

}
