using WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Services
{
    public class UserService
    {
        private readonly CSDLBanHang _context;
        private readonly OrderService _orderService;

        public UserService(CSDLBanHang context, OrderService orderService)
        {
            _context = context;
            _orderService = orderService;
        }

        public async Task<User> CheckPhoneAsync(string phone)
        {

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Phone == phone);
            if (user == null)
            {
                throw new KeyNotFoundException($"Not Found User with number {phone}");
            }

            return user;
        }

        public async Task DeleteDependencieAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return;

            var orderIds = await _context.Orders
                .Where(cs => cs.UserId == id)
                .Select(cs => cs.Id)
                .ToListAsync();

            if (orderIds.Any())
            {
                await Task.WhenAll(orderIds.Select(orderId => _orderService.DeleteDependencieAsync(orderId)));
            }


            _context.Users.Remove(user);

            await _context.SaveChangesAsync();
        }
    }
}
