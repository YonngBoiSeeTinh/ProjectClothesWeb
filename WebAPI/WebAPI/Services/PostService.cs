using WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;


namespace WebAPI.Services
{
    public class PostService
    {
        private readonly CSDLBanHang _context;
     
        public PostService(CSDLBanHang context)
        {
            _context = context;
        }

        public async Task<List<Post>> GetByType (String type)
        {
            var posts = await _context.Posts
                        .Where(p => EF.Functions.Collate(p.Type, "SQL_Latin1_General_CP1_CI_AI").Contains(type))
                        .ToListAsync();

            if (posts == null || posts.Count == 0)
            {
                throw new Exception($"Không tìm thấy post nào với type: {type}");
            }

            return posts;
          
          
        }

    }

}
