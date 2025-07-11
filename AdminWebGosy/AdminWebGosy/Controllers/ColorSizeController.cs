using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using AdminWebGosy.Models;

namespace AdminWebGosy.Controllers
{
    public class ColorSizeController : Controller
    { 
        private readonly HttpClient _httpClient;
        private readonly ILogger<ColorSizeController> _logger;
        public ColorSizeController(HttpClient httpClient, ILogger<ColorSizeController> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7192/api/ColorSizes");
            _logger = logger;
        }
        [HttpGet]
        public async Task<IActionResult> Index(int productId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://localhost:7192/api/ColorSizes/ProductColorSize/{productId}");
                if (response.IsSuccessStatusCode)
                {
                    var colorSizes = await response.Content.ReadFromJsonAsync<IEnumerable<ColorSize>>();
                   
                    return PartialView("_Index",colorSizes);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError("Lỗi : {Error}", ex);
            }

            return PartialView("_Index",new List<ColorSize>());
        }
        [HttpGet]
        public async Task<IActionResult> OpenEditModal(int colorSizeId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://localhost:7192/api/ColorSizes/{colorSizeId}");
                if (response.IsSuccessStatusCode)
                {
                    var colorSizes = await response.Content.ReadFromJsonAsync<ColorSize>();
                  
                    return PartialView("_EditColorModal", colorSizes);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError("Lỗi : {Error}", ex);
            }

            return PartialView("_EditColorModal", new ColorSize());
        }

        [HttpPost]
        public async Task<IActionResult> UpdateColor(ColorSize colorSize)
        {
            try
            {
                int id = colorSize.Id;
                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(colorSize),
                    System.Text.Encoding.UTF8,
                    "application/json"
                );
                var response = await _httpClient.PutAsync($"https://localhost:7192/api/ColorSizes/{id}", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Status: {Status}, Response: {Response}", response.StatusCode, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("colorSize đã được cập nhật thành công!");
                    return RedirectToAction("EditProductModal", "Product", new { productId = colorSize .ProductId});
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Lỗi khi cập nhật colorSize: {Error}", responseContent);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating colorSize");
                return RedirectToAction("EditProductModal", "Product", new { productId = colorSize.ProductId });
            }

            return RedirectToAction("EditProductModal", "Product", new { productId = colorSize.ProductId });
        }

        public async Task<IActionResult> OpenAddModal(int productId)
        {
           
            return PartialView("_AddColorModal", productId);
        }
        [HttpPost]
        public async Task<IActionResult> AddColor(ColorSize colorSize)
        {
            try
            {
                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(colorSize),
                    System.Text.Encoding.UTF8,
                    "application/json"
                );
                var jsonPayload = System.Text.Json.JsonSerializer.Serialize(colorSize);
                _logger.LogInformation("Request Payload: {Payload}", jsonPayload);

                // Gửi request đến API
                var response = await _httpClient.PostAsync($"https://localhost:7192/api/ColorSizes", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Status: {Status}, Response: {Response}", response.StatusCode, responseContent);

                if (response.IsSuccessStatusCode)
                {

                    _logger.LogInformation("create colorSize success!");

                    return RedirectToAction("EditProductModal", "Product", new { productId = colorSize.ProductId });

                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Lỗi khi thêm colorSize: {Error}", responseContent);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating colorSize");
                return RedirectToAction("EditProductModal", "Product", new { productId = colorSize.ProductId });
            }

            return RedirectToAction("EditProductModal", "Product", new { productId = colorSize.ProductId });
        }
        [HttpPost]
        public async Task<IActionResult> DeleteColor(int id,int productId)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"https://localhost:7192/api/ColorSizes/{id}");
                var responseContent = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    return RedirectToAction("EditProductModal", "Product", new { productId = productId }); 
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                }
            }
            catch (Exception ex)
            {
                return RedirectToAction("EditProductModal", "Product", new { productId = productId });
            }

            return RedirectToAction("EditProductModal", "Product", new { productId = productId });
        }
    }
}
