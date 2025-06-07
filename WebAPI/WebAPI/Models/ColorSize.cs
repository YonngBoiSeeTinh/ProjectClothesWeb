using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class ColorSize : BaseEntity
{
   

    public int ProductId { get; set; }

    public string Color { get; set; } = null!;

    public string Size { get; set; } = null!;
    public string Code { get; set; } = null!;

    public int Quantity { get; set; }

    public decimal Price { get; set; }

   
}
