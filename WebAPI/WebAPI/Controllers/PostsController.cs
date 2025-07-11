using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.DTO;
using WebAPI.Factory;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        //factory design parttern
        private readonly IRepository<Post> _postRepository;
        private PostService _postService;

        public PostsController(CSDLBanHang context, PostService productService)
        {
            _postRepository = RepositoryFactory.CreateRepository<Post>(context);
            _postService = productService;
        }

        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            return Ok(await _postRepository.GetAllAsync());
        }

        // GET: api/Posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(int id)
        {
            try
            {
                var Post = await _postRepository.GetByIdAsync(id);
                return Ok(Post);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

               // GET: api/Posts/5
        [HttpGet("byType/{type}")]
        public async Task<ActionResult<IEnumerable<Post>>> GetPostByType(String type)
        {
            try
            {
                var Post = await _postService.GetByType(type);
                return Ok(Post);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // PUT: api/Posts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PustPost(int id, [FromForm] PostDTO postDTO, IFormFile? image)
        {
            try
            {
                var post = new Post
                {
                    CreatedAt = postDTO.CreatedAt,
                    Id = id,
                    Type = postDTO.Type,
                    Content = postDTO.Content,
                    Question = postDTO.Question,
                    Authur = postDTO.Authur,
                    Title = postDTO.Title,

                };
                if (postDTO.CreatedAt == null)
                {
                    return BadRequest(new { message = "CreatedAt không được để trống." });
                }
                if(image != null)
                    await _postRepository.UpdateAsync(post, image);
                else
                    await _postRepository.UpdateAsync(post);
                return NoContent();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
     
        [HttpPost]
        public async Task<ActionResult<Post>> PostPost([FromForm] PostDTO postDTO, IFormFile? image)
        {
            try
            {
                var post = new Post
                {
                  
                    Type = postDTO.Type,
                    Content = postDTO.Content,
                    Question = postDTO.Question,
                    Authur = postDTO.Authur,
                    Title = postDTO.Title,
                };
                await _postRepository.AddAsync(post, image);
                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/Posts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost (int id)
        {

            try
            {
                await _postRepository.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }

}
