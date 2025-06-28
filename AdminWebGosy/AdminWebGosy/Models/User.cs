using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace WebAPI.Models;

    public partial class User : BaseEntity
{
    public string Name { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public int? Role { get; set; }

    public String Image { get; set; }

    public decimal? TotalBuy { get; set; }

    public int? Account { get; set; }
    public string? RoleName => Role switch
    {
        1 => "Khách vãng lai",
        2 => "Admin",
        3 => "Nhân viên",
        4 => "Khách hàng thường",
        5 => "Khách hàng Bạc",
        6 => "Khách hàng Vàng",
        7 => "Khách hàng Kim Cương",
        _ => null
    };

}
