using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using AdminWebGosy.Models;
using static NuGet.Packaging.PackagingConstants;
using System.Collections;
using Microsoft.Extensions.Options;

namespace AdminWebGosy.Controllers
{
    public class UserController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<UserController> _logger;

        public UserController(HttpClient httpClient, ILogger<UserController> logger, IOptions<ApiSettings> apiSettings)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(apiSettings.Value.BaseUrl+"/Users");
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var response = await _httpClient.GetAsync("");
                if (response.IsSuccessStatusCode)
                {
                    var users = await response.Content.ReadFromJsonAsync<IEnumerable<User>>();
                    var lstUser = new  List<User>();
                    foreach (User u in users)
                    {
                        if(u.Role != 2)
                        {
                            lstUser.Add(u);
                        }
                    }
                    return View(lstUser);
                }
                else
                {
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Failed to fetch users. Response: {errorMessage}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching users.");
            }

            return View(new List<User>());
        }
        [HttpGet]
        public async Task<IActionResult> GetInforUser(int userId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/{userId}");
                if (response.IsSuccessStatusCode)
                {
                    var user = await response.Content.ReadFromJsonAsync<User>();
                    return PartialView("_UserInforModal", user);
                    
                }
                else
                {
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Failed to fetchuser. Response: {errorMessage}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching user.");
            }

            return View();
        }
    
        [HttpPost]
        public async Task<IActionResult> AddUser(User user, IFormFile? image)
        {
            try
            {
                using var formData = new MultipartFormDataContent();
                formData.Add(new StringContent(user.Name), "Name");
                formData.Add(new StringContent("0"), "TtalBuy");
                formData.Add(new StringContent("1"), "Role");
                formData.Add(new StringContent(user.Phone ?? ""), "Description");
                formData.Add(new StringContent(user.Address ?? ""), "Address");
               

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
                    TempData["ApiLog"] = "Admin đã được thêm thành công!";
                    return RedirectToAction("ProductList");
                }
                else
                {
                    TempData["ApiLog"] = $"Lỗi khi thêm Admin: {responseContent}";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in AddProduct");
                TempData["ApiLog"] = $"Error: {ex.Message}";
            }

            return RedirectToAction("ProductList");
        }


    }
}
