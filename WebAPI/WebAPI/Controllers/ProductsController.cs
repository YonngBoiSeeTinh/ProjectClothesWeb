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
    public class ProductsController : ControllerBase
    {
        //factory design parttern
        private readonly IRepository<Product> _ProductRepository;
        private ProductService _ProductService;

        public ProductsController(CSDLBanHang context, ProductService productService)
        {
            _ProductRepository = RepositoryFactory.CreateRepository<Product>(context);
            _ProductService = productService;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return Ok(await _ProductRepository.GetAllAsync());
        }

        // GET: api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            try
            {
                var Product = await _ProductRepository.GetByIdAsync(id);
                return Ok(Product);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // PUT: api/Product/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, [FromForm] ProductDTO productDto, IFormFile? image)
        {
            try
            {
                var product = new Product
                {
                    CreatedAt = productDto.CreatedAt,
                    Id = id,
                    Name = productDto.Name,
                    Promo = productDto.Promo,
                    Description = productDto.Description,
                    Price = productDto.Price,
                    Unit = productDto.Unit,
                    CategoryId = productDto.CategoryId,
                    Rate = productDto.Rate,
                    Sold = productDto.Sold,
                    Brand = productDto.Brand,
                    StarsRate = productDto.StarsRate,
                };
                if (productDto.CreatedAt == null)
                {
                    return BadRequest(new { message = "CreatedAt không được để trống." });
                }
                if(image != null)
                    await _ProductRepository.UpdateAsync(product, image);
                else
                    await _ProductRepository.UpdateAsync(product);
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
        // PUT: api/ColorSizes/5
        [HttpPut("updateSold/{id}")]
        public async Task<IActionResult> UpdateSold(int id, int quantity)
        {

            try
            {
                await _ProductService.UpdateSold(id, quantity);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        // POST: api/Product
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct([FromForm] ProductDTO productDto, IFormFile? image)
        {
            try
            {
                var product = new Product
                {
                    Name = productDto.Name,
                    Description = productDto.Description,
                    Price = productDto.Price,
                    Unit = productDto.Unit,
                    CategoryId = productDto.CategoryId,
                    Rate = productDto.Rate,
                    StarsRate = productDto.StarsRate,
                    Sold  = productDto.Sold,
                    Brand = productDto.Brand,
                    Promo = productDto.Promo,
                };

                await _ProductRepository.AddAsync(product, image);
                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {

            try
            {
                await _ProductService.DeleteDependencieAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }

}
