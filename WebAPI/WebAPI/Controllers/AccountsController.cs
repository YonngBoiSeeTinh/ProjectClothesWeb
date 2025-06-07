using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Factory;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        //factory design parttern
        private readonly IRepository<Account> _accountRepository;
        private readonly AccountService _accountService;

        public AccountsController(CSDLBanHang context, AccountService accountService)
        {
            _accountRepository = RepositoryFactory.CreateRepository<Account>(context);
            _accountService = accountService;
        }

        // GET: api/Accounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Account>>> GetAccount()
        {
            return Ok(await _accountRepository.GetAllAsync());
        }

        // GET: api/Accounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Account>> GetAccount(int id)
        {
            try
            {
                var Account = await _accountRepository.GetByIdAsync(id);
                return Ok(Account);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        // GET: api/Users/CheckUser/1
        [HttpGet("CheckUser/{id}")]
        public async Task<ActionResult<Account>> CheckUser(int id)
        {
            try
            {
                var user = await _accountService.CheckUserAsync(id);

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
        // PUT: api/Accounts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccount(int id, Account Account)
        {
            try
            {
                Account.Id = id;
                await _accountRepository.UpdateAsync(Account);
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

        // POST: api/Accounts
        [HttpPost]
        public async Task<ActionResult<Account>> PostAccount(Account Account)
        {
            try
            {
                await _accountService.CreateAccountAsync(Account);
                return CreatedAtAction(nameof(GetAccount), new { id = Account.Id }, Account);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/Accounts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {

            try
            {
                await _accountRepository.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpPost("login")]
        //routes.MapRoute(   sap.net truyen thong dinh nghia api phuc tap
        //    name: "DefaultApi",
        //    routeTemplate: "api/{controller}/{id}",
        //    defaults: new { id = RouteParameter.Optional
        //    }
        //);
        public async Task<ActionResult<int>> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                var userId = await _accountService.LoginAsync(loginRequest.Email, loginRequest.Password);
                return Ok(userId); // Trả về ID tài khoản
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        public class LoginRequest
        {
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
        }
    }

}
