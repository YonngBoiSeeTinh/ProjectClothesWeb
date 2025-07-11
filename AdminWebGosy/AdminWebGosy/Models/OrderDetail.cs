using System;
using System.Collections.Generic;

namespace AdminWebGosy.Models;

public partial class OrderDetail : BaseEntity
{
  

    public int OrderId { get; set; }

    public int ColorSizeId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public int? ProductId { get; set; }

    public String? ProductName { get; set; }


}
