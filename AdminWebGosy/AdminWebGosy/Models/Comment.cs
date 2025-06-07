using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Comment : BaseEntity
{

    public int ProductId { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; }

    public float Stars { get; set; }

    public string? Content { get; set; }

    public DateTime CreatedAt { get; set; }
}
