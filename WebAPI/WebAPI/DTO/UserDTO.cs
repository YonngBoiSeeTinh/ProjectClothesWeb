using Newtonsoft.Json;

namespace WebAPI.DTO;

public class UserDTO
{

    public string Name { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public int? Role { get; set; }

    public decimal? TotalBuy { get; set; }

    public int? Account { get; set; }
    public DateTime? CreatedAt { get; set; }

   
}

