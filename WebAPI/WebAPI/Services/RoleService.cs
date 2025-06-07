using WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Services
{
    public class RoleService
    {
        private readonly CSDLBanHang _context;
        private readonly UserService _userService;

        public RoleService(CSDLBanHang context, UserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task DeleteDependencieAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return;

            var userIds = await _context.Users
               .Where(cs => cs.Role == id)
               .Select(cs => cs.Id)
               .ToListAsync();

            if (userIds.Any())
            {
                await Task.WhenAll(userIds.Select(userId => _userService.DeleteDependencieAsync(userId)));
            }


            _context.Users.Remove(user);

            await _context.SaveChangesAsync();
        }
    }
}
