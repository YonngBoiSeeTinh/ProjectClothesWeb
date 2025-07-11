using System.Collections.Generic;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using AdminWebGosy.Models;

namespace AdminWebGosy.Controllers
{
    public class OrderController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<OrderController> _logger;

        public OrderController(HttpClient httpClient, ILogger<OrderController> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7192/api/Orders");
            _logger = logger;
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
                    ViewData["countOrder"] = nonAcceptOrders.Count();
                    ViewData["status"] = status;

                    return View(orders);
                }
                else
                {
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Failed to fetch orders. Response: {errorMessage}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching orders.");
            }

            return View(new List<Order>());
        }

        [HttpPost]
        public async Task<IActionResult> UpdateOrder(Order order)
        {
            try
            {
                int id = order.Id;

                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(order),
                    System.Text.Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PutAsync($"https://localhost:7192/api/Orders/{id}", content);
                if (response.IsSuccessStatusCode)
                {
                    var status = ViewData["status"] as string;
                    if (order.Status == "Đã giao hàng") {
                        var responseUser = await _httpClient.PutAsync($"https://localhost:7192/api/Users/updateRole/{order.UserId}?totalBuy={order.TotalPrice}", null);
                        var responseContent = await responseUser.Content.ReadAsStringAsync();
                        _logger.LogInformation("Update User: {Status}, Response: {Response}", response.StatusCode, responseContent);
                        if (responseUser.IsSuccessStatusCode)
                        {
                            return RedirectToAction("Index", new { status = status });

                        }
                    }
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Failed to update order {OrderId}. Error: {Error}", id, error);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating the order.");
            }

            var currentStatus = ViewData["status"] as string;
            return !string.IsNullOrEmpty(currentStatus)
                ? RedirectToAction("Index", new { status = currentStatus })
                : RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> OrderModal(int orderId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/{orderId}");

                if (response.IsSuccessStatusCode)
                {
                    var order = await response.Content.ReadFromJsonAsync<Order>();
                    var orderDetails = await GetOrderDetails(orderId);
                    ViewBag.OrderDetailList = orderDetails;
                    return PartialView("_orderModal", order);
                }
                else
                {
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Failed to fetch order details for Order ID: {OrderId}. Error: {ErrorMessage}", orderId, errorMessage);
                  
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching order details for Order ID: {OrderId}", orderId);
            }
            return StatusCode(500);
        }
        [HttpGet]
        public async Task<IEnumerable<OrderDetail>> GetOrderDetails(int orderId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://localhost:7192/api/OrderDetails/ByOrder/{orderId}");

                if (response.IsSuccessStatusCode)
                {
                    var orderDetails = await response.Content.ReadFromJsonAsync<IEnumerable<OrderDetail>>();

                    foreach (var item in orderDetails)
                    {
                        var pro = await GetProduct(item.ProductId);
                        item.ProductName = pro.Name;
                    }

                    return orderDetails;
                }
                else
                {
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Failed to fetch order details for Order ID: {OrderId}. Error: {ErrorMessage}", orderId, errorMessage);
                    return Enumerable.Empty<OrderDetail>(); // trả về danh sách rỗng thay vì lỗi
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred while fetching order details for Order ID: {OrderId}", orderId);
                return Enumerable.Empty<OrderDetail>(); 
            }
        }


        [HttpGet]
        public async Task<Product?> GetProduct(int? productId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://localhost:7192/api/Products/{productId}");
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadFromJsonAsync<Product>();
                }

                _logger.LogError("Failed to fetch product. Status: {Status}", response.StatusCode);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching product.");
                return null;
            }
        }



        [HttpPost]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"https://localhost:7192/api/Orders/{id}");
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Order deleted successfully. Order ID: {OrderId}", id);
                    return RedirectToAction("Index");
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Failed to delete order {OrderId}. Error: {Error}", id, error);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting the order {OrderId}", id);
            }

            return RedirectToAction("Index");
        }
    }
}
