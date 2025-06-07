using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    private readonly string AccessKey;
    private readonly string SecretKey;
    private readonly string PartnerCode;
    private readonly string RedirectUrl;
    private readonly string RedirectUrlAndroid;
    private readonly string NotifyURL;
    private readonly string NotifyURLAndroid;
    private readonly string RequestType;

    public PaymentController(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;

        // Lấy giá trị từ appsettings.json
        AccessKey = "F8BBA842ECF85";
        SecretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        PartnerCode = "MOMO";
        RedirectUrl = "http://localhost:5173/payment-result";
        RedirectUrlAndroid = "https://www.mygosyapp.com/paymentResult";
        NotifyURL = "http://localhost:5173/payment-failed";
        NotifyURLAndroid = "https://www.mygosyapp.com/paymentResult";
        RequestType = "captureMoMoWallet";
    }

    [HttpPost("create-payment")]
    public async Task<IActionResult> CreatePayment([FromBody] PaymentRequest request)
    {
        try
        {
            int cleanAmount = int.Parse(System.Text.RegularExpressions.Regex.Replace(request.Amount.ToString(), "[^0-9]", ""));
            if (cleanAmount < 1000 || cleanAmount > 50000000)
            {
                return BadRequest(new { message = "Số tiền thanh toán phải từ 1,000 VND đến 50,000,000 VND" });
            }

            string orderId = PartnerCode + DateTime.UtcNow.Ticks;
            string requestId = orderId;

            // Generate signature
            string rawSignature = $"partnerCode={PartnerCode}&accessKey={AccessKey}&requestId={requestId}&amount={cleanAmount}&orderId={orderId}&orderInfo={request.OrderInfo}&returnUrl={RedirectUrl}&notifyUrl={NotifyURL}&extraData={""}&storeId=MomoTestStore";
            string signature = GenerateHmacSha256(rawSignature, SecretKey);

            var requestBody = new
            {

                partnerCode = PartnerCode,
                partnerName = "GOSY Strore",
                storeId = "MomoTestStore",
                requestId = requestId,
                amount = request.Amount, 
                orderId = orderId,
                orderInfo = request.OrderInfo,
                redirectUrl = RedirectUrl,
                ipnUrl = NotifyURL,
                lang = "vi",
                requestType = RequestType,
                autoCapture = true,
                signature = signature,
                accessKey = AccessKey,
                notifyUrl = NotifyURL,
                returnUrl = RedirectUrl,
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(_configuration["MomoAPI:MomoApiUrl"], content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                return Ok(JsonConvert.DeserializeObject(responseString));
            }
            else
            {
                return StatusCode((int)response.StatusCode, responseString);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
    [HttpPost("create-paymentandroid")]
    public async Task<IActionResult> CreatePaymentAndroid([FromBody] PaymentRequest request)
    {
        try
        {
            int cleanAmount = int.Parse(System.Text.RegularExpressions.Regex.Replace(request.Amount.ToString(), "[^0-9]", ""));
            if (cleanAmount < 1000 || cleanAmount > 50000000)
            {
                return BadRequest(new { message = "Số tiền thanh toán phải từ 1,000 VND đến 50,000,000 VND" });
            }

            string orderId = PartnerCode + DateTime.UtcNow.Ticks;
            string requestId = orderId;

            // Generate signature
            string rawSignature = $"partnerCode={PartnerCode}&accessKey={AccessKey}&requestId={requestId}&amount={cleanAmount}&orderId={orderId}&orderInfo={request.OrderInfo}&returnUrl={RedirectUrlAndroid}&notifyUrl={NotifyURLAndroid}&extraData={""}&storeId=MomoTestStore";
            string signature = GenerateHmacSha256(rawSignature, SecretKey);

            var requestBody = new
            {
                partnerCode = PartnerCode,
                partnerName = "GOSY Strore",
                storeId = "MomoTestStore",
                requestId = requestId,
                amount = request.Amount,
                orderId = orderId,
                orderInfo = request.OrderInfo,
                redirectUrl = RedirectUrlAndroid,
                ipnUrl = NotifyURLAndroid,
                lang = "vi",
                requestType = RequestType,
                autoCapture = true,
                signature = signature,
                accessKey = AccessKey,
                notifyUrl = NotifyURLAndroid,
                returnUrl = RedirectUrlAndroid,
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(_configuration["MomoAPI:MomoApiUrl"], content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                return Ok(JsonConvert.DeserializeObject(responseString));
            }
            else
            {
                return StatusCode((int)response.StatusCode, responseString);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
    private string GenerateHmacSha256(string data, string key)
    {
        using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key)))
        {
            return BitConverter.ToString(hmac.ComputeHash(Encoding.UTF8.GetBytes(data))).Replace("-", "").ToLower();
        }
    }
}

public class PaymentRequest
{
    public string Amount { get; set; }
    public string OrderInfo { get; set; }
}
