using WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Services
{
    public class AccountService
    {
        private readonly CSDLBanHang _context;


        public AccountService(CSDLBanHang context)
        {
            _context = context;

        }
        public async Task<Account> CheckUserAsync(int id)
        {

            var user = await _context.Accounts.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
            {
                throw new KeyNotFoundException($"Not Found User with id {id}");
            }

            return user;
        }
        public async Task<Account> CreateAccountAsync(Account account)
        {
            // Kiểm tra nếu email đã tồn tại
            if (await _context.Accounts.AnyAsync(a => a.Email == account.Email))
            {
                throw new InvalidOperationException("Email đã tồn tại.");
            }
            if (account.UserId == null)
            {
                throw new InvalidOperationException("Không tìm thấy user");
            }
           
            // Mã hóa mật khẩu
            account.Password = BCrypt.Net.BCrypt.HashPassword(account.Password);

            // Thêm tài khoản vào cơ sở dữ liệu
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return account;
        }
        public async Task<int> LoginAsync(string email, string password)
        {
            // Tìm tài khoản theo email
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Email == email);
            if (account == null || !BCrypt.Net.BCrypt.Verify(password, account.Password))
            {
                throw new InvalidOperationException("Email hoặc mật khẩu không đúng.");
            }

            // Trả về ID tài khoản
            return account.UserId;
        }

    }
}
