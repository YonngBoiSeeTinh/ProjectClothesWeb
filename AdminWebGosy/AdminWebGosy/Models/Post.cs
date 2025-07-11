using System;
using System.Collections.Generic;

namespace AdminWebGosy.Models;

public partial class Post : BaseEntity
{

    public string? Type { get; set; }

    public string? Authur { get; set; } 

    public string? Content { get; set; }

    public string? Question { get; set; }
    public string? Title { get; set; } 
    public String? Image { get; set; }


}
