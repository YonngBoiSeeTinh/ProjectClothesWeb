using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WebAPI.Models;

namespace AdminWebGosy.Controllers
{
    public class UserController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<UserController> _logger;

        public UserController(HttpClient httpClient, ILogger<UserController> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7192/api/Users");
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var response = await _httpClient.GetAsync("");
                if (response.IsSuccessStatusCode)
                {
                    var orders = await response.Content.ReadFromJsonAsync<IEnumerable<User>>();
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

            return View(new List<User>());
        }

        
    }
}
