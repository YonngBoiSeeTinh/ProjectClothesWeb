using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using AdminWebGosy.Models;
using Microsoft.Extensions.Options;

namespace AdminWebGosy.Controllers
{
    public class ProductController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ProductController> _logger;

        public ProductController(HttpClient httpClient, ILogger<ProductController> logger, IOptions<ApiSettings> apiSettings)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(apiSettings.Value.BaseUrl);
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct(Product product, IFormFile? image)
        {
            try
            {
                using var formData = new MultipartFormDataContent();
                formData.Add(new StringContent(product.Name), "Name");
                formData.Add(new StringContent("GOSY"), "Brand");
                formData.Add(new StringContent("0"), "StarsRate");
                formData.Add(new StringContent("0"), "Promo");
                formData.Add(new StringContent("0"), "Banner");
                formData.Add(new StringContent(product.Description ?? ""), "Description");
                formData.Add(new StringContent(product.Price.ToString()), "Price");
                formData.Add(new StringContent(product.Unit), "Unit");
                formData.Add(new StringContent(product.CategoryId.ToString()), "CategoryId");

                if (image != null && image.Length > 0)
                {
                    var streamContent = new StreamContent(image.OpenReadStream());
                    streamContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
                    formData.Add(streamContent, "image", image.FileName);
                }

                var response = await _httpClient.PostAsync(_httpClient.BaseAddress+"/Products", formData);
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
        public async Task<IActionResult> UpdateProduct(int id, Product product, IFormFile? image)
        {
            try
            {
                using var formData = new MultipartFormDataContent();
                formData.Add(new StringContent(product.Name ?? ""), "Name");
                formData.Add(new StringContent(product.Brand ?? ""), "Brand");

                if (product.CreatedAt != null)
                {
                    formData.Add(new StringContent(product.CreatedAt.Value.ToString("o")), "CreatedAt");
                }

                formData.Add(new StringContent(product.StarsRate.ToString()), "StarsRate");
                formData.Add(new StringContent(product.Rate.ToString()), "Rate");
                formData.Add(new StringContent(product.Sold.ToString()), "Sold");
                formData.Add(new StringContent(product.Promo.ToString()), "Promo");
                formData.Add(new StringContent(product.Description ?? ""), "Description");
                formData.Add(new StringContent(product.Banner.ToString()), "Banner");
                formData.Add(new StringContent(product.Price.ToString()), "Price");
                formData.Add(new StringContent(product.Unit ?? ""), "Unit");
                formData.Add(new StringContent(product.CategoryId.ToString()), "CategoryId");

                if (image != null && image.Length > 0)
                {
                    var streamContent = new StreamContent(image.OpenReadStream());
                    streamContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
                    formData.Add(streamContent, "image", image.FileName);
                }

                var response = await _httpClient.PutAsync($"{_httpClient.BaseAddress}/Products/{id}", formData);
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
        public async Task<IActionResult> UpdateBanner(int id,int isBanner)
        {
            try
            {
                var response = await _httpClient.PutAsync($"{_httpClient.BaseAddress}/Products/updateBanner/{id}?isBanner={isBanner}",null);
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("API Response: {StatusCode}, Content: {ResponseContent}", response.StatusCode, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    return RedirectToAction("ProductList");
                }
                    
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in UpdateProduct");
             
            }

            return RedirectToAction("ProductList");
        }

        [HttpPost]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"{_httpClient.BaseAddress}/Products/{id}");
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
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/Products");
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
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/Products/{productId}");
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
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/ColorSizes/ProductColorSize/{productId}");
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
                var responseCate = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/Categories");
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
