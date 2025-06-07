using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Factory;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionsController : ControllerBase
    {
        //factory design parttern
        private readonly IRepository<Promotion> _PromotionRepository;
      

        public PromotionsController(CSDLBanHang context)
        {
            _PromotionRepository = RepositoryFactory.CreateRepository<Promotion>(context);
           
        }

        // GET: api/Promotions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Promotion>>> GetPromotions()
        {
            return Ok(await _PromotionRepository.GetAllAsync());
        }

        // GET: api/Promotions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Promotion>> GetPromotion(int id)
        {
            try
            {
                var Promotion = await _PromotionRepository.GetByIdAsync(id);
                return Ok(Promotion);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
       
        // PUT: api/Promotions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPromotion(int id, Promotion Promotion)
        {
            try
            {
                Promotion.Id = id;
                await _PromotionRepository.UpdateAsync(Promotion);
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

        // POST: api/Promotions
        [HttpPost]
        public async Task<ActionResult<Promotion>> PostPromotion(Promotion Promotion)
        {
            try
            {
                await _PromotionRepository.AddAsync(Promotion);
                return CreatedAtAction(nameof(GetPromotion), new { id = Promotion.Id }, Promotion);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/Promotions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePromotion(int id)
        {
           
            try
            {
                await _PromotionRepository.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }

}
