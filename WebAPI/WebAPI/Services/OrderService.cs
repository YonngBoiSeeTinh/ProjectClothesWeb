using WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Services
{
    public class OrderService
    {
        private readonly CSDLBanHang _context;

        public OrderService(CSDLBanHang context)
        {
            _context = context;
        }
        public async Task<List<Order>> GetOrdersByUserAsync(int userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                throw new KeyNotFoundException($"No orders found for User with ID: {userId}");
            }

            return orders;
        }

        public async Task DeleteDependencieAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return;

            await _context.OrderDetails
                .Where(od => od.OrderId == id)
                .ExecuteDeleteAsync();


            _context.Orders.Remove(order);

            await _context.SaveChangesAsync();
        }
    }
}
