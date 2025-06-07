using WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Services
{
    public class DetailService
    {
        private readonly CSDLBanHang _context;

        public DetailService(CSDLBanHang context)
        {
            _context = context;
        }

       
        public async Task<List<Detail>> GetByProductAsync(int productId)
        {
            // Lấy danh sách ColorSize theo ProductId
            var Detail = await _context.Details
                                           .Where(cs => cs.ProductId == productId)
                                           .ToListAsync();

         
            return Detail ?? new List<Detail>();
        }

    }
}
