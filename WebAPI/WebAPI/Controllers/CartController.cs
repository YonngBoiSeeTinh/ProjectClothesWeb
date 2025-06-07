using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Factory;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        //factory design parttern
        private readonly IRepository<Cart> _CartRepository;
        private readonly CartService _cartService;

        public CartsController(CSDLBanHang context, CartService cartService)
        {
            _CartRepository = RepositoryFactory.CreateRepository<Cart>(context);
            _cartService = cartService;
        }

        // GET: api/Carts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCarts()
        {
            return Ok(await _CartRepository.GetAllAsync());
        }

        // GET: api/Carts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cart>> GetCart(int id)
        {
            try
            {
                var Cart = await _CartRepository.GetByIdAsync(id);
                return Ok(Cart);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        // GET: api/Carts/User/5
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCartsByUser(int userId)
        {
            try
            {
                var carts = await _cartService.GetByUserAsync(userId);
               

                return Ok(carts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        // PUT: api/Carts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCart(int id, Cart Cart)
        {
            try
            {
                Cart.Id = id;
                await _CartRepository.UpdateAsync(Cart);
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

        // POST: api/Carts
        [HttpPost]
        public async Task<ActionResult<Cart>> PostCart(Cart Cart)
        {
            try
            {
                await _CartRepository.AddAsync(Cart);
                return CreatedAtAction(nameof(GetCart), new { id = Cart.Id }, Cart);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/Carts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            try
            {
                await _CartRepository.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            } 
        }
        [HttpDelete("ByUser/{id}")]
        public async Task<IActionResult> DeleteAllCart(int id)
        {
            try
            {
                await _cartService.DeleteAllByUser(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpDelete("BySelectedItem/{id}")]
        public async Task<IActionResult> DeleteSelectedCart([FromBody] List<int> ids, int id)
        {
            try
            {
                if (ids == null || ids.Count == 0)
                {
                    return BadRequest(new { message = "Danh sách ids không hợp lệ hoặc rỗng." });
                }

                await _cartService.DeleteselectetedCart(ids, id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

    }

}
