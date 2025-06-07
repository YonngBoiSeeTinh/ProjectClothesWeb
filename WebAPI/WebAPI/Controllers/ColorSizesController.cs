using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Factory;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorSizesController : ControllerBase
    {
        private readonly IRepository<ColorSize> _colorSizeRepository;
        private ColorSizesService _colorSizesService;

        public ColorSizesController(CSDLBanHang context)
        {
            _colorSizeRepository = RepositoryFactory.CreateRepository<ColorSize>(context);
            _colorSizesService = new ColorSizesService(context);
        }

        // GET: api/ColorSizes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ColorSize>>> GetColorSizes()
        {
            return Ok(await _colorSizeRepository.GetAllAsync());
        }

        // GET: api/ColorSizes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ColorSize>> GetColorSize(int id)
        {
            try
            {
                var colorSize = await _colorSizeRepository.GetByIdAsync(id);
                return Ok(colorSize);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpGet("ProductColorSize/{id}")]
        public async Task<ActionResult<ColorSize>> GetColorSizeByProduct(int id)
        {
            try
            {
                var colorSize = await _colorSizesService.GetByProductAsync(id);
                return Ok(colorSize);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // PUT: api/ColorSizes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutColorSize(int id, ColorSize colorSize)
        {
           

            try
            {
                colorSize.Id = id;
                await _colorSizeRepository.UpdateAsync(colorSize);
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

        // POST: api/ColorSizes
        [HttpPost]
        public async Task<ActionResult<ColorSize>> PostColorSize(ColorSize colorSize)
        {
            try
            {
                await _colorSizeRepository.AddAsync(colorSize);
                return CreatedAtAction(nameof(GetColorSize), new { id = colorSize.Id }, colorSize);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/ColorSizes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColorSize(int id)
        {
            
            try
            {
                await _colorSizesService.DeleteDependencieAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }

}
