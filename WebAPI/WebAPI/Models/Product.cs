using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Product : BaseEntity,IHasImage
{
  
    public string Name { get; set; } = null!;

    public string Brand { get; set; }
    public string? Description { get; set; }

    public decimal Price { get; set; }

    public string? Unit { get; set; }

    public int CategoryId { get; set; }

    public int Promo { get; set; }

    public byte[]? Image { get; set; }

    public int? Sold { get; set; }

    public int? Rate { get; set; }

    public int? Banner { get; set; }

    public int? StarsRate { get; set; }

}
