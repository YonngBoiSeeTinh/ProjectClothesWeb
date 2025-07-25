﻿using WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Services
{
    public class ColorSizesService
    {
        private readonly CSDLBanHang _context;

        public ColorSizesService(CSDLBanHang context)
        {
            _context = context;
        }

        public async Task DeleteDependencieAsync(int id)
        {
            var colorsize = await _context.ColorSizes.FindAsync(id);
            if (colorsize == null) return;

            await _context.OrderDetails
                .Where(od => od.ColorSizeId == id)
                .ExecuteDeleteAsync();


            _context.ColorSizes.Remove(colorsize);

            await _context.SaveChangesAsync();
        }
        public async Task<List<ColorSize>> GetByProductAsync(int productId)
        {
            // Lấy danh sách ColorSize theo ProductId
            var colorSizes = await _context.ColorSizes
                                           .Where(cs => cs.ProductId == productId)
                                           .ToListAsync();

            // Kiểm tra nếu không có kết quả, trả về danh sách rỗng
            return colorSizes ?? new List<ColorSize>();
        }
        public async Task UpdateStock(int colorSizeId, int quantity)
        {
            var colorSize = await _context.ColorSizes.FindAsync(colorSizeId);

            if (colorSize == null)
            {
                throw new Exception($"ColorSize với Id {colorSizeId} không tồn tại.");
            }

            // Cập nhật số lượng
            colorSize.Quantity = colorSize.Quantity- quantity;
            _context.ColorSizes.Update(colorSize);
            await _context.SaveChangesAsync();
        }

    }
}
