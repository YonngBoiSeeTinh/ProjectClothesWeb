using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebAPI.Models;

namespace AdminWebGosy.Controllers
{
    public class OrderController : Controller
    {
        private readonly HttpClient _httpClient;
        public OrderController(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7192/api/Orders");
        }
        
        public async Task<IActionResult> Index(string status = null)
        {
            try
            {
                var response = await _httpClient.GetAsync("");
                if (response.IsSuccessStatusCode)
                {
                    var orders = await response.Content.ReadFromJsonAsync<IEnumerable<Order>>();
                    if (!string.IsNullOrEmpty(status))
                    {
                        orders = orders.Where(o => o.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
                    }
                    var nonAcceptOrders = orders.Where(order => order.Status == "Chờ xác nhận");
                    TempData["countOrder"] = nonAcceptOrders.Count();
                    TempData["status"] = status;
                    return View(orders);
                }

            }
            catch (Exception ex)
            {
                TempData["ApiLog"] = $"Đã xảy ra lỗi: {ex.Message}";
            }

            return View(new List<Order>());
        }
        [HttpPost]
        public async Task<IActionResult> UpdateOrder( Order order)
        {
            try
            {
                int id = order.Id;
              
                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(order),
                    System.Text.Encoding.UTF8,
                    "application/json"
                );
                // Gửi request đến API
                var response = await _httpClient.PutAsync($"https://localhost:7192/api/Orders/{id}", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                TempData["ApiLog"] = $"Status: {response.StatusCode}, Response: {responseContent}";
                if (response.IsSuccessStatusCode)
                {
                    var status = TempData["status"] as string;
                    TempData["ApiLog"] = "Order đã được cập nhật thành công!";
                    return RedirectToAction("Index", new { status = status });
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    TempData["ApiLog"] = $"Lỗi khi cập nhật Order: {error}";
                }
            }
            catch (Exception ex)
            {
                TempData["ApiLog"] = $"Error: {ex.Message}\nStackTrace: {ex.StackTrace}";
                return RedirectToAction("Index");
            }
            var currentStatus = TempData["status"] as string;

            if (!string.IsNullOrEmpty(currentStatus))
            {
                return RedirectToAction("Index", new { status = currentStatus });
            }
            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://localhost:7192/api/OrderDetails/ByOrder/{orderId}");

                if (response.IsSuccessStatusCode)
                {
                    var orderDetails = await response.Content.ReadFromJsonAsync<IEnumerable<OrderDetail>>();
                    return Json(orderDetails); 
                }
                else
                {
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    TempData["ApiLog"] = $"Không thể lấy chi tiết đơn hàng: {errorMessage}";
                    return StatusCode((int)response.StatusCode, "Không thể lấy dữ liệu chi tiết đơn hàng.");
                }
            }
            catch (Exception ex)
            {
                TempData["ApiLog"] = $"Error: {ex.Message}\nStackTrace: {ex.StackTrace}";
                return StatusCode(500, "Đã xảy ra lỗi khi xử lý yêu cầu.");
            }
        }

    }
}
