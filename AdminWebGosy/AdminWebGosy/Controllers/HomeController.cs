using System.Net.Http;
using System.Net.Http.Json;
using AdminWebGosy.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using AdminWebGosy.Models;

namespace AdminWebGosy.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly HttpClient _httpClient;
       
        public HomeController(HttpClient httpClient, ILogger<HomeController> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7192/api");
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var response = await _httpClient.GetAsync(_httpClient.BaseAddress+ "/Orders/getRevenue");
                var responseUser = await _httpClient.GetAsync(_httpClient.BaseAddress + "/Users/getNew");
                var responseDataChart = await _httpClient.GetAsync(_httpClient.BaseAddress + "/Orders/getDataChart");
                if (response.IsSuccessStatusCode && responseUser.IsSuccessStatusCode && responseDataChart.IsSuccessStatusCode)
                {
                    var revenue = await response.Content.ReadFromJsonAsync<Revenue>();
                    revenue.NewUser = await responseUser.Content.ReadFromJsonAsync<int>();
                    revenue.DataBarChart = await responseDataChart.Content.ReadFromJsonAsync<List<DataChart>>();
                    return View(revenue);
                }
            }
            catch(Exception ex)
            {
                _logger.LogError("L?i khi get revenue: {Error}", ex);
            }

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

      
    }
}
