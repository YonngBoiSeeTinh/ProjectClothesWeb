using WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Services
{
    public class OrderDetailService
    {
        private readonly CSDLBanHang _context;

        public OrderDetailService(CSDLBanHang context)
        {
            _context = context;
        }
        public async Task<List<OrderDetail>> GetByOrderId(int orderid)
        {
            var orders = await _context.OrderDetails
                .Where(o => o.OrderId == orderid)
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                throw new KeyNotFoundException($"No orders found for User with ID: {orderid}");
            }

            return orders;
        }

           }
}
