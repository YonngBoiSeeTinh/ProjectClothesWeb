using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;

namespace AdminWebGosy.Controllers
{
    public class CategoryController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(HttpClient httpClient, ILogger<CategoryController> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7192/api/Categories");
            _logger = logger;
        }
        public async Task<IActionResult> Index()
        {
            try
            {
                var response = await _httpClient.GetAsync("");
                if (response.IsSuccessStatusCode)
                {
                    var products = await response.Content.ReadFromJsonAsync<IEnumerable<Category>>();
                    return View(products);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Đã xảy ra lỗi khi tải danh sách danh muc.");
            }

            return View(new List<Category>());
        }
        [HttpGet]
        public async Task<IActionResult> OpenEditModal(int cateId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/{cateId}");
                if (response.IsSuccessStatusCode)
                {
                    var category = await response.Content.ReadFromJsonAsync<Category>();
                    return PartialView("_EditCategoryModal", category);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in _EditCategoryModal");
            }

            return StatusCode(500);
        }
        [HttpPost]
        public async Task<IActionResult> UpdateCategory(int id, Category category, IFormFile? image)
        {
            try
            {
                using var formData = new MultipartFormDataContent();
                formData.Add(new StringContent(category.Name ?? ""), "Name");
               if (category.CreatedAt != null)
                {
                    formData.Add(new StringContent(category.CreatedAt.Value.ToString("o")), "CreatedAt");
                }
             
                formData.Add(new StringContent(category.Description ?? ""), "Description");
              

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
                    return RedirectToAction("Index");
                }

            }
            catch (Exception ex)
            {
                TempData["ApiLog"] = $"Error: {ex.Message}";
            }

            return RedirectToAction("Index");
        }
        [HttpPost]
        public async Task<IActionResult> AddCategory(Category category, IFormFile? image)
        {
            try
            {
                using var formData = new MultipartFormDataContent();
                formData.Add(new StringContent(category.Name), "Name");
                formData.Add(new StringContent(category.Description ?? ""), "Description");
              
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
                    return RedirectToAction("Index");
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

            return RedirectToAction("Index");
        }
        [HttpPost]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"{_httpClient.BaseAddress}/{id}");
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("API Response: {StatusCode}, Content: {ResponseContent}", response.StatusCode, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in delete category");
            }

            return RedirectToAction("Index");
        }

    }
}
