using System;
using System.Collections.Generic;

namespace AdminWebGosy.Models;

public partial class Role : BaseEntity
{
   

    public string Name { get; set; } = null!;

    public int? Promo { get; set; }

   
}
