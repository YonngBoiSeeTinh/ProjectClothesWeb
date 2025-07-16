using AdminWebGosy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

public class AccountController : Controller
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AccountController> _logger;

    public AccountController(HttpClient httpClient, ILogger<AccountController> logger, IOptions<ApiSettings> apiSettings)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(apiSettings.Value.BaseUrl);
        _logger = logger;
    }

    public IActionResult Index() => View();

    [HttpPost]
    public async Task<IActionResult> Login(Account account)
    {
        try
        {
            var loginRequest = new { Email = account.Email, Password = account.Password };

            var response = await _httpClient.PostAsJsonAsync($"{_httpClient.BaseAddress}/Accounts/login", loginRequest);

            var responseContent = await response.Content.ReadAsStringAsync();

            _logger.LogInformation("Login Response - Status: {Status}, Body: {Body}", response.StatusCode, responseContent);

            if (response.IsSuccessStatusCode)
            {
                var userId = responseContent.Trim('"');
                var responseUser = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/Users/{userId}");
               


                if (!responseUser.IsSuccessStatusCode)
                {
                    ViewBag.Error = "Không thể lấy thông tin người dùng.";
                    return View("Index");
                }

                var user = await responseUser.Content.ReadFromJsonAsync<User>();
                if (user != null && user.Role == 2)
                {
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ViewBag.Error = "Bạn không đủ quyền hạn để truy cập";
                    return View("Index");
                }
            }
            else
            {
                ViewBag.Error = "Tài khoản hoặc mật khẩu không chính xác";
                return View("Index");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in Login");
            ViewBag.Error = "Đã xảy ra lỗi khi đăng nhập.";
            return View("Index");
        }
    }
}
