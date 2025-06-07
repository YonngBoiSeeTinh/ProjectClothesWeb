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
    public class CategoriesController : ControllerBase
    {
        private readonly IRepository<Category> _CategoryRepository;
        private CategoriesService _categoriesService;

        public CategoriesController(CSDLBanHang context, CategoriesService categoriesService)
        {
            _CategoryRepository = RepositoryFactory.CreateRepository<Category>(context);
            _categoriesService = categoriesService;


        }

        // GET: api/Categorys
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategorys()
        {
            return Ok(await _CategoryRepository.GetAllAsync());
        }
    
        // GET: api/Categorys/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            try
            {
                var Category = await _CategoryRepository.GetByIdAsync(id);
                return Ok(Category);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // PUT: api/Categorys/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, [FromForm] CategoryDTO categoryDTO, IFormFile? image)
        {
            try
            {
                var category = new Category
                {
                    Id = id,
                    Name = categoryDTO.Name,
                    Description = categoryDTO.Description,
                    CreatedAt = categoryDTO.CreatedAt,
                };

                await _CategoryRepository.UpdateAsync(category, image);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật Category", details = ex.Message });
            }
        }


        // POST: api/Categorys
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory([FromForm] CategoryDTO categoryDTO, IFormFile? image)
        {
            try
            {
                var category = new Category
                {
                    Name = categoryDTO.Name,
                    Description = categoryDTO.Description,
                };


                await _CategoryRepository.AddAsync(category, image);
                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/Categorys/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                await _categoriesService.DeleteDependencieAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }

}
