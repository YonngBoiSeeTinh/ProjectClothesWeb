    using System.Net.Http;
    using System.Net.Http.Headers;
    using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebAPI.Models;

    namespace AdminWebGosy.Controllers
    {
        public class ProductController : Controller
        {
            private readonly HttpClient _httpClient;

            public ProductController(HttpClient httpClient)
            {
                _httpClient = httpClient;
                _httpClient.BaseAddress = new Uri("https://localhost:7192/api/Products");
            }

            [HttpPost]
            public async Task<IActionResult> AddProduct(Product productt, IFormFile? image)
            {
                try
                {
                    using var formData = new MultipartFormDataContent();
                    formData.Add(new StringContent(productt.Name), "Name");
                    //formData.Add(new StringContent(productt.Brand), "Brand");
                    formData.Add(new StringContent("GOSY"), "Brand");
                    formData.Add(new StringContent("0"), "StarsRate");
                    formData.Add(new StringContent("0"), "Promo");
                    formData.Add(new StringContent(productt.Description ?? ""), "Description");
                    formData.Add(new StringContent(productt.Price.ToString()), "Price");
                    formData.Add(new StringContent(productt.Unit), "Unit");
                    formData.Add(new StringContent(productt.CategoryId.ToString()), "CategoryId");

                    if (image != null && image.Length > 0)
                    {
                        var streamContent = new StreamContent(image.OpenReadStream());
                        streamContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
                        formData.Add(streamContent, "image", image.FileName);
                    }
                    // Gửi request đến API
                    var response = await _httpClient.PostAsync("", formData);
                    var responseContent = await response.Content.ReadAsStringAsync();
                    TempData["ApiLog"] = $"Status: {response.StatusCode}, Response: {responseContent}";
                    if (response.IsSuccessStatusCode)
                    {
                        TempData["ApiLog"] = "Sản phẩm đã được thêm thành công!";
                        return RedirectToAction("ProductList");
                    }
                    else
                    {
                        var error = await response.Content.ReadAsStringAsync();
                        TempData["ApiLog"] = $"Lỗi khi thêm sản phẩm: {error}";
                    }
                }
                catch (Exception ex)
                {
                    TempData["ApiLog"] = $"Error: {ex.Message}";
                    return RedirectToAction("ProductList");
                }

                return RedirectToAction("ProductList");
            }
            [HttpPost]
             public async Task<IActionResult> UpdateProduct(int id, Product productt, IFormFile? image)
        {
          
            try
            {

                id = productt.Id;
                using var formData = new MultipartFormDataContent();

                formData.Add(new StringContent(productt.Name ?? ""), "Name");
                formData.Add(new StringContent(productt.Brand ?? ""), "Brand");

                if (productt.CreatedAt != null)
                {
                    formData.Add(new StringContent(productt.CreatedAt.Value.ToString("o")), "CreatedAt");
                }
                else
                {
                    formData.Add(new StringContent(""), "CreatedAt");
                }

                formData.Add(new StringContent(productt.StarsRate.ToString()), "StarsRate");
                formData.Add(new StringContent(productt.Promo.ToString()), "Promo");
                formData.Add(new StringContent(productt.Description ?? ""), "Description");
                formData.Add(new StringContent(productt.Price.ToString()), "Price");
                formData.Add(new StringContent(productt.Unit ?? ""), "Unit");
                formData.Add(new StringContent(productt.CategoryId.ToString()), "CategoryId");

                if (image != null && image.Length > 0)
                {
                    var streamContent = new StreamContent(image.OpenReadStream());
                    streamContent.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
                    formData.Add(streamContent, "image", image.FileName);
                }

                // Gửi request đến API
                var response = await _httpClient.PutAsync($"https://localhost:7192/api/Products/{id}", formData);
                var responseContent = await response.Content.ReadAsStringAsync();
                TempData["ApiLog"] = $"Status: {response.StatusCode}, Response: {responseContent}";
                if (response.IsSuccessStatusCode)
                {
                    TempData["ApiLog"] = "Sản phẩm đã được cập nhật thành công!";
                    return RedirectToAction("ProductList");
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    TempData["ApiLog"] = $"Lỗi khi cập nhật sản phẩm: {error}";
                }
            }
            catch (Exception ex)
            {
                TempData["ApiLog"] = $"Error: {ex.Message}";
                return RedirectToAction("ProductList");
            }

            return RedirectToAction("ProductList");
        }

            [HttpPost]
            public async Task<IActionResult> DeleteProduct(int id)    {
                    try  {

                    var response = await _httpClient.DeleteAsync($"https://localhost:7192/api/Products/{id}");
                    var responseContent = await response.Content.ReadAsStringAsync();
                    TempData["ApiLog"] = $"Status: {response.StatusCode}, Response: {responseContent}";
                    if (response.IsSuccessStatusCode) {
                        TempData["ApiLog"] = "Sản phẩm đã được xóa thành công!";
                        return RedirectToAction("ProductList");
                    }
                    else  {
                        var error = await response.Content.ReadAsStringAsync();
                        TempData["ApiLog"] = $"Lỗi khi xóa sản phẩm: {error}";
                    }
                    }
                    catch (Exception ex)
                    {
                        TempData["ApiLog"] = $"Error: {ex.Message}";
                        return RedirectToAction("ProductList");
                    }

                return RedirectToAction("ProductList");
            }


            public async Task LoadCategoriesAsync() {
                var responseCate = await _httpClient.GetAsync("https://localhost:7192/api/Categories");
                if (responseCate.IsSuccessStatusCode)
                {
                    var jsonString = await responseCate.Content.ReadAsStringAsync();
                    var categories = JsonConvert.DeserializeObject<List<Category>>(jsonString);
                    ViewBag.Categories = categories;
                }
                else
                {
                    ViewBag.Categories = new List<Category>();
                }
             }
            public async Task<IActionResult> ProductList()
                {
                    try
                    {
                        await LoadCategoriesAsync();
                        var response = await _httpClient.GetAsync("");
                        if (response.IsSuccessStatusCode)
                        {
                            var products = await response.Content.ReadFromJsonAsync<IEnumerable<Product>>();
                            var responseContent = await response.Content.ReadAsStringAsync();
                  
                            return View(products);
                        }
                   
                    }
                    catch (Exception ex)
                    {
                        TempData["ApiLog"] = $"Đã xảy ra lỗi: {ex.Message}";
                    }

                    return View(new List<Product>());
                }
            }
    }
