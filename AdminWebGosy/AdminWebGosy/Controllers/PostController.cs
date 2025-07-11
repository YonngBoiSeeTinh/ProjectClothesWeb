using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using AdminWebGosy.Models;

namespace AdminWebGosy.Controllers
{
    public class PostController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<PostController> _logger;

        public PostController(HttpClient httpClient, ILogger<PostController> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7192/api/Posts");
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> AddPost(Post post, IFormFile? image)
        {
            try
            {
                using var formData = new MultipartFormDataContent();
                formData.Add(new StringContent(post.Type), "type");
                formData.Add(new StringContent(post.Content ?? ""), "content");
                
                formData.Add(new StringContent(post.Authur ?? ""), "authur");
                formData.Add(new StringContent(post.Title ?? ""), "title");


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
                    _logger.LogError( "Error occurred in add post");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in add post");
                TempData["ApiLog"] = $"Error: {ex.Message}";
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> UpdatePost(int id, Post post, IFormFile? image)
        {
            try
            {
                using var formData = new MultipartFormDataContent();
               
                if (post.CreatedAt != null)
                {
                    formData.Add(new StringContent(post.CreatedAt.Value.ToString("o")), "CreatedAt");
                }

                formData.Add(new StringContent(post.Type), "type");
                formData.Add(new StringContent(post.Content ?? ""), "content");
                
                formData.Add(new StringContent(post.Authur ?? ""), "authur");
                formData.Add(new StringContent(post.Title ?? ""), "title");

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
                    TempData["ApiLog"] = "Sản phẩm đã được cập nhật thành công!";
                    return RedirectToAction("Index");
                }
               
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in UpdateProduct");
                TempData["ApiLog"] = $"Error: {ex.Message}";
            }

            return RedirectToAction("Index");
        }
       
        [HttpPost]
        public async Task<IActionResult> DeletePost(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"{_httpClient.BaseAddress}/{id}");
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("API Response: {StatusCode}, Content: {ResponseContent}", response.StatusCode, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    TempData["ApiLog"] = "Sản phẩm đã được xóa thành công!";
                    return RedirectToAction("Index");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in DeleteProduct");
                TempData["ApiLog"] = $"Error: {ex.Message}";
            }

            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var response = await _httpClient.GetAsync("");
                if (response.IsSuccessStatusCode)
                {
                    var products = await response.Content.ReadFromJsonAsync<IEnumerable<Post>>();
                    return View(products);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching post list");
            }

            return View(new List<Post>());
        }

        public async Task<IActionResult> EditPostModal(int postId)
        {
          
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}/{postId}");
                if (response.IsSuccessStatusCode)
                {
                    var post = await response.Content.ReadFromJsonAsync<Post>();
                    return PartialView("_EditPostModal", post);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in EditProductModal");
                TempData["ApiLog"] = $"Đã xảy ra lỗi: {ex.Message}";
            }

            return StatusCode(500);
        }

       
    }
}
