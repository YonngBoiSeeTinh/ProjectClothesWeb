using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Category : BaseEntity
{
   

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public String Image { get; set; }

    
}
