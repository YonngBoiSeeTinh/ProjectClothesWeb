using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Account : BaseEntity
{


    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

   
}
