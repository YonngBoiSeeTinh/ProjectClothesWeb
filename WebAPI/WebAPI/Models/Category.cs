using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Category : BaseEntity, IHasImage
{
   

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public byte[]? Image { get; set; }

    
}
