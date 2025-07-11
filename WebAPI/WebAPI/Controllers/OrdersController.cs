using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Factory;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        //factory design parttern
        private readonly IRepository<Order> _OrderRepository;
        private OrderService _OrderService;

        public OrdersController(CSDLBanHang context)
        {
            _OrderRepository = RepositoryFactory.CreateRepository<Order>(context);
            _OrderService = new OrderService(context);

        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return Ok(await _OrderRepository.GetAllAsync());
        }

        [HttpGet("getRevenue")]
        public async Task<IActionResult> GetRevenue()
        {
            return Ok(await _OrderService.getRevenue());
        }
        [HttpGet("getDataChart")]
        public async Task<IActionResult> DataChart()
        {
            return Ok(await _OrderService.getDataChart());
        }
        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            try
            {
                var Order = await _OrderRepository.GetByIdAsync(id);
                return Ok(Order);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        // GET: api/Users/CheckUser/1
        [HttpGet("User/{id}")]
        public async Task<ActionResult<List<Order>>> GetByUser(int id)
        {
            try
            {
                var orders = await _OrderService.GetOrdersByUserAsync(id);

                return Ok(orders);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", details = ex.Message });
            }
        }
        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order Order)
        {
            try
            {
                Order.Id = id;
                await _OrderRepository.UpdateAsync(Order);
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

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order Order)
        {
            try
            {
                await _OrderRepository.AddAsync(Order);
                //status 201
                return CreatedAtAction(nameof(GetOrder), new { id = Order.Id }, Order);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {

            try
            {
                await _OrderService.DeleteDependencieAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }

}
