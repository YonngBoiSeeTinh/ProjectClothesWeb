using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Post : BaseEntity,IHasImage
{
    public string? Type { get; set; }

    public string? Authur { get; set; } 
    public string? Content { get; set; }

    public string? Question { get; set; } 
    public string? Title { get; set; } 
    public byte[]? Image { get; set; }

    

}
