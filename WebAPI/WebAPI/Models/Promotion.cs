using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Promotion : BaseEntity
{
   

    public string Name { get; set; } = null!;

    public decimal Value { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxValue { get; set; }
    public string Code { get; set; } = null!;

    public DateTime? EndAt { get; set; }
}
