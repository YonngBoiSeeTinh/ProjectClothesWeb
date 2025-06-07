using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace WebAPI.Models;

    public partial class User : BaseEntity, IHasImage
{
    public string Name { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public int? Role { get; set; }

    public byte[]? Image { get; set; }

    public decimal? TotalBuy { get; set; }

    public int? Account { get; set; }

   
}
