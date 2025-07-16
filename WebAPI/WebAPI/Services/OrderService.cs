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


            return orders ?? new List<Order>();
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
        public async Task<Revenue> getRevenue()
        {
            var now = DateTime.Now;

            decimal totalDay = await _context.Orders
                .Where(o =>  o.CreatedAt.HasValue &&
                             o.CreatedAt.Value.Day == now.Day &&
                             o.CreatedAt.Value.Month == now.Month &&
                             o.CreatedAt.Value.Year == now.Year &&
                             o.Status == "Đã giao hàng"
                )
                .SumAsync(o => o.TotalPrice);

            decimal totalMonth = await _context.Orders
                .Where(o => o.CreatedAt.HasValue &&
                            o.CreatedAt.Value.Month == now.Month &&
                            o.CreatedAt.Value.Year == now.Year &&
                            o.Status == "Đã giao hàng")
                .SumAsync(o => o.TotalPrice);

            int totalOrder = 0;
            totalOrder = await _context.Orders
            .Where(o => o.CreatedAt.HasValue &&
                        o.CreatedAt.Value.Month == now.Month &&
                        o.CreatedAt.Value.Year == now.Year)
            .CountAsync();

            Revenue revenue = new Revenue(totalMonth, totalDay, totalOrder);
            return revenue;


        }

        public async Task<List<DataChart>> getDataChart()
        {
            var now = DateTime.Now;
            var sixMonthsAgo = now.AddMonths(-5);

            var orders = await _context.Orders
                .Where(o => o.CreatedAt.HasValue &&
                            o.CreatedAt.Value >= new DateTime(sixMonthsAgo.Year, sixMonthsAgo.Month, 1) &&
                            o.CreatedAt.Value <= now &&
                            o.Status == "Đã giao hàng")
                .ToListAsync();

            Dictionary<(int Month, int Year), decimal> dict = new();

            foreach (var o in orders)
            {
                if (!o.CreatedAt.HasValue) continue;

                var key = (o.CreatedAt.Value.Month, o.CreatedAt.Value.Year);
                if (dict.ContainsKey(key))
                {
                    dict[key] += o.TotalPrice;
                }
                else
                {
                    dict[key] = o.TotalPrice;
                }
            }

            var data = dict.Select(d => new DataChart(d.Key.Month, d.Key.Year, d.Value))
                           .OrderBy(dc => dc.Year)
                           .ThenBy(dc => dc.Month)
                           .ToList();

            return data;
        }



    }
}
