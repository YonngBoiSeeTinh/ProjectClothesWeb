using WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Services
{
    public class CartService
    {
        private readonly CSDLBanHang _context;

        public CartService(CSDLBanHang context)
        {
            _context = context;
        }

        public async Task<List<Cart>> GetByUserAsync(int id)
        {
            var carts = await _context.Carts
           .Where(cart => cart.UserId == id)
           .ToListAsync();

            return carts;
        }

        public async Task DeleteAllByUser(int id)
        {
            var carts = await _context.Carts.Where(cart => cart.UserId == id).ToListAsync();
            if (carts == null || !carts.Any())
            {
                throw new KeyNotFoundException($"No orders found for User with ID: {id}");
            }

            await _context.Carts.Where(cart => cart.UserId == id).ExecuteDeleteAsync();
        }
        public async Task DeleteselectetedCart(List<int> ids, int userId)
        {
            if (ids == null || !ids.Any())
            {
                throw new ArgumentException("The list of IDs to delete cannot be null or empty.", nameof(ids));
            }
           
            var carts = await _context.Carts
                .Where(cart => cart.UserId == userId && ids.Contains(cart.Id))
                .ToListAsync();

            if (carts == null || !carts.Any())
            {
                throw new KeyNotFoundException($"No carts found for User with ID: {userId} and provided IDs.");
            }

            
            await _context.Carts
                .Where(cart => cart.UserId == userId && ids.Contains(cart.Id))
                .ExecuteDeleteAsync();
        }

    }
}
