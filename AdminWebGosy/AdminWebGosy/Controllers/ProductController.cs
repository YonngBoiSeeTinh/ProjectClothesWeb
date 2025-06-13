using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WebAPI.Models;

namespace AdminWebGosy.Controllers
{
    public class ProductController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ProductController> _logger;

        public ProductController(HttpClient httpClient, ILogger<ProductController> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7192/api/Products");
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct(Product productt, IFormFile? image)
        {
            try
            {
                using var formData = new MultipartFormDataContent();
                formData.Add(new StringContent(productt.Name), "Name");
                formData.Add(new StringContent("GOSY"), "Brand");
                formData.Add(new StringContent("0"), "StarsRate");
                formData.Add(new StringContent("0"), "Promo");
                formData.Add(new StringContent(productt.Description ?? ""), "Description");
                formData.Add(new StringContent(productt.Price.ToString()), "Price");
                formData.Add(new StringContent(productt.Unit), "Unit");
                formData.Add(new StringContent(productt.CategoryId.ToString()), "CategoryId");

                if (image != null && image.Length > 0)
                {
                    var streamContent = new StreamContent(image.OpenReadStream());
                    streamContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
                    formData.Add(streamContent, "image", image.FileName);
                }

                var response = await _httpClient.PostAsync("", formData);
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("API Response: {StatusCode}, Content: {ResponseContent}", response.StatusCode, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    TempData["ApiLog"] = "Sản phẩm đã được thêm thành công!";
                    return RedirectToAction("ProductList");
                }
                else
                {
                    TempData["ApiLog"] = $"Lỗi khi thêm sản phẩm: {responseContent}";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in AddProduct");
                TempData["ApiLog"] = $"Error: {ex.Message}";
            }

            return RedirectToAction("ProductList");
        }

        [HttpPost]
        public async Task<IActionResult> UpdateProduct(int id, Product productt, IFormFile? image)
        {
            try
            {
                using var formData = new MultipartFormDataContent();
                formData.Add(new StringContent(productt.Name ?? ""), "Name");
                formData.Add(new StringContent(productt.Brand ?? ""), "Brand");

                if (productt.CreatedAt != null)
                {
                    formData.Add(new StringContent(productt.CreatedAt.Value.ToString("o")), "CreatedAt");
                }

                formData.Add(new StringContent(productt.StarsRate.ToString()), "StarsRate");
                formData.Add(new StringContent(productt.Rate.ToString()), "Rate");
                formData.Add(new StringContent(productt.Sold.ToString()), "Sold");
                formData.Add(new StringContent(productt.Promo.ToString()), "Promo");
                formData.Add(new StringContent(productt.Description ?? ""), "Description");
                formData.Add(new StringContent(productt.Price.ToString()), "Price");
                formData.Add(new StringContent(productt.Unit ?? ""), "Unit");
                formData.Add(new StringContent(productt.CategoryId.ToString()), "CategoryId");

                if (image != null && image.Length > 0)
                {
                    var streamContent = new StreamContent(image.OpenReadStream());
                    streamContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
                    formData.Add(streamContent, "image", image.FileName);
                }

                var response = await _httpClient.PutAsync($"{_httpClient.BaseAddress}/{id}", formData);
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("API Response: {StatusCode}, Content: {ResponseContent}", response.StatusCode, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    TempData["ApiLog"] = "Sản phẩm đã được cập nhật thành công!";
                    return RedirectToAction("ProductList");
                }
               
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in UpdateProduct");
                TempData["ApiLog"] = $"Error: {ex.Message}";
            }

            return RedirectToAction("ProductList");
        }

        [HttpPost]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"{_httpClient.BaseAddress}/{id}");
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("API Response: {StatusCode}, Content: {ResponseContent}", response.StatusCode, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    TempData["ApiLog"] = "Sản phẩm đã được xóa thành công!";
                    return RedirectToAction("ProductList");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in DeleteProduct");
                TempData["ApiLog"] = $"Error: {ex.Message}";
            }

            return RedirectToAction("ProductList");
        }

        public async Task<IActionResult> ProductList()
        {
            try
            {
                await LoadCategoriesAsync();
                var response = await _httpClient.GetAsync("");
                if (response.IsSuccessStatusCode)
                {
                    var products = await response.Content.ReadFromJsonAsync<IEnumerable<Product>>();
                    return View(products);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching product list");
                TempData["ApiLog"] = $"Đã xảy ra lỗi: {ex.Message}";
            }

            return View(new List<Product>());
        }

        public async Task<IActionResult> EditProductModal(int productId)
        {
            await LoadCategoriesAsync();
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/{productId}");
                if (response.IsSuccessStatusCode)
                {
                    var product = await response.Content.ReadFromJsonAsync<Product>();
                    return View("_EditProductModal", product);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in EditProductModal");
                TempData["ApiLog"] = $"Đã xảy ra lỗi: {ex.Message}";
            }

            return StatusCode(500);
        }

        public async Task<IActionResult> GetColorSize(int productId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://localhost:7192/api/ColorSizes/ProductColorSize/{productId}");
                if (response.IsSuccessStatusCode)
                {
                    var colorSizes = await response.Content.ReadFromJsonAsync<IEnumerable<ColorSize>>();
                    return Json(colorSizes);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in GetColorSize");
                TempData["ApiLog"] = $"Error: {ex.Message}";
            }

            return StatusCode(500);
        }

        private async Task LoadCategoriesAsync()
        {
            try
            {
                var responseCate = await _httpClient.GetAsync("https://localhost:7192/api/Categories");
                if (responseCate.IsSuccessStatusCode)
                {
                    var categories = await responseCate.Content.ReadFromJsonAsync<List<Category>>();
                    ViewBag.Categories = categories;
                }
                else
                {
                    ViewBag.Categories = new List<Category>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading categories");
                ViewBag.Categories = new List<Category>();
            }
        }
    }
}
