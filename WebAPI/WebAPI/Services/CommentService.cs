using WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Services
{
    public class CommentService
    {
        private readonly CSDLBanHang _context;

        public CommentService(CSDLBanHang context)
        {
            _context = context;
        }


        public async Task<List<Comment>> GetByProductAsync(int productId)
        {
            // Lấy danh sách ColorSize theo ProductId
            var Comment = await _context.Comments
                                        .Where(cs => cs.ProductId == productId)
                                        .ToListAsync();


            return Comment ?? new List<Comment>();
        }

    }
}
