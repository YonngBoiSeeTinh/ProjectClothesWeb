using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Role : BaseEntity
{
   

    public string Name { get; set; } = null!;

    public int? Promo { get; set; }

   
}
