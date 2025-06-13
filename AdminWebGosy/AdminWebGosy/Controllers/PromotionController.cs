using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;

namespace AdminWebGosy.Controllers
{
    public class PromotionController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<PromotionController> _logger;

        public PromotionController(HttpClient httpClient, ILogger<PromotionController> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7192/api/Promotions");
            _logger = logger;
        }
        public async Task<IActionResult> Index()
        {
            try
            {
                var response = await _httpClient.GetAsync("");
                if (response.IsSuccessStatusCode)
                {
                    var products = await response.Content.ReadFromJsonAsync<IEnumerable<Promotion>>();
                    return View(products);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Đã xảy ra lỗi khi tải danh sách voucher.");
            }

            return View(new List<Promotion>());
        }
        [HttpGet]
        public async Task<IActionResult> OpenEditModal(int promoId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/{promoId}");
                if (response.IsSuccessStatusCode)
                {
                    var promotion = await response.Content.ReadFromJsonAsync<Promotion>();
                    return PartialView("_EditPromotionModal", promotion);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in _EditPromotionModal");
            }

            return StatusCode(500);
        }
        [HttpPost]
        public async Task<IActionResult> UpdatePromotion(Promotion promotion)
        {
            try
            {
                int id = promotion.Id;
                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(promotion),
                    System.Text.Encoding.UTF8,
                    "application/json"
                );
                var response = await _httpClient.PutAsync($"{_httpClient.BaseAddress}/{id}", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Status: {Status}, Response: {Response}", response.StatusCode, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in updatePromotion");
            }

            return RedirectToAction("Index");
        }
        [HttpPost]
        public async Task<IActionResult> AddPromotion(Promotion promotion)
        {
            try
            {
                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(promotion),
                    System.Text.Encoding.UTF8,
                    "application/json"
                );
                var response = await _httpClient.PutAsync($"{_httpClient.BaseAddress}", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("API Response: {StatusCode}, Content: {ResponseContent}", response.StatusCode, responseContent);
                if (response.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
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
        public async Task<IActionResult> DeletePromotion(int id)
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
                _logger.LogError(ex, "Error occurred in delete promotion");
            }

            return RedirectToAction("Index");
        }

    }
}
