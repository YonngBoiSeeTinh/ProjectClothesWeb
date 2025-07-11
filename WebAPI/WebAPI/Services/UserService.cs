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

        public async Task UpdateRole(int userId, decimal totalBuy)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                throw new Exception($"user với Id {userId} không tồn tại.");
            }

            // Cập nhật số lượng
            user.TotalBuy = user.TotalBuy + totalBuy;
            if (user.TotalBuy <= 500000) { user.Role = 4; }
            else if(user.TotalBuy > 500000 && user.TotalBuy <=1200000) { user.Role = 5; }
            else if (user.TotalBuy > 1200000 && user.TotalBuy <= 2000000) { user.Role = 6; }
            else if (user.TotalBuy >2000000) { user.Role = 7; }
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
        public async Task<int> getNewRegister()
        {
            var now = DateTime.Now.Date;

           
           return await _context.Users
            .Where(o => o.CreatedAt.HasValue &&
                        o.CreatedAt.Value.Month == now.Month &&
                        o.CreatedAt.Value.Year == now.Year)
            .CountAsync();



        }
    }
}
