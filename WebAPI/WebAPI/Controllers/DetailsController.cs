using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Factory;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetailsController : ControllerBase
    {
        private readonly IRepository<Detail> _DetailRepository;
        private readonly DetailService _detailService;
        public DetailsController(CSDLBanHang context)
        {
            _DetailRepository = RepositoryFactory.CreateRepository<Detail>(context);
            _detailService = new DetailService(context);
        }

        // GET: api/Details
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Detail>>> GetDetails()
        {
            return Ok(await _DetailRepository.GetAllAsync());
        }

        // GET: api/Details/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Detail>> GetDetail(int id)
        {
            try
            {
                var Detail = await _DetailRepository.GetByIdAsync(id);
                return Ok(Detail);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpGet("ProductDetail/{id}")]
        public async Task<ActionResult<Detail>> GetColorSizeByProduct(int id)
        {
            try
            {
                var details = await _detailService.GetByProductAsync(id);
                return Ok(details);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        // PUT: api/Details/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetail(int id, Detail Detail)
        {
            
            try
            {
                Detail.Id = id;
                await _DetailRepository.UpdateAsync(Detail);
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

        // POST: api/Details
        [HttpPost]
        public async Task<ActionResult<Detail>> PostDetail(Detail Detail)
        {
            try
            {
                await _DetailRepository.AddAsync(Detail);
                return CreatedAtAction(nameof(GetDetail), new { id = Detail.Id }, Detail);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/Details/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetail(int id)
        {
            try
            {
                await _DetailRepository.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }

}
