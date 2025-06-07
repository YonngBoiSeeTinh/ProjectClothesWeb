using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.DTO;
using WebAPI.Factory;
using WebAPI.Models;
using WebAPI.Services;
using Newtonsoft.Json;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        //factory design parttern
        private readonly IRepository<User> _UserRepository;
        private UserService _UserService;

        public UsersController(CSDLBanHang context, UserService userService)
        {
            _UserRepository = RepositoryFactory.CreateRepository<User>(context);
            _UserService = userService;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUser()
        {
            return Ok(await _UserRepository.GetAllAsync());
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            try
            {
                var User = await _UserRepository.GetByIdAsync(id);
                return Ok(User);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // GET: api/Users/CheckUser/1
        [HttpGet("CheckUser/{phone}")]
        public async Task<ActionResult<User>> CheckUser(string phone)
        {
            try
            {
                // Gọi phương thức CheckPhoneAsync từ service
                var user = await _UserService.CheckPhoneAsync(phone);

                return Ok(user);
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


        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, [FromForm] UserDTO userDTO, IFormFile? image)
        {
            try
            {
                var user = new User
                {
                    Id = id,
                    Name = userDTO.Name,
                    Phone = userDTO.Phone,
                    Address = userDTO.Address,
                    Role = userDTO.Role,
                    TotalBuy = userDTO.TotalBuy,
                    Account = userDTO.Account,
                    //DateofBirth = userDTO.DateofBirth,
                    CreatedAt = userDTO.CreatedAt,
                };
                if (userDTO.CreatedAt == null)
                {
                    return BadRequest(new { message = "CreatedAt không được để trống." });
                }
                if (image != null)
                    await _UserRepository.UpdateAsync(user, image);
                else
                    await _UserRepository.UpdateAsync(user);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser([FromForm] UserDTO userDTO, IFormFile? image)
        {
            try
            {
                var user = new User
                {
                    Name = userDTO.Name,
                    Phone = userDTO.Phone,
                    Address = userDTO.Address,
                    Role = userDTO.Role,
                    TotalBuy = userDTO.TotalBuy,
                    Account = 0,
                 
                };
                if (image == null)
                {
                    await _UserRepository.AddAsync(user);
                }
                else
                {
                    await _UserRepository.AddAsync(user, image);
                }
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {

            try
            {
                await _UserService.DeleteDependencieAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }

}
