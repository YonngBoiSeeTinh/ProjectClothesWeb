using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Order : BaseEntity
{

    public int UserId { get; set; }

    public decimal TotalPrice { get; set; }

    public string? Status { get; set; }

    public string? Name { get; set; }

    public string? PaymentMethod { get; set; }
    public string? PaymentStatus { get; set; }
    public string? CancellationReason { get; set; }
    public string? Note { get; set; }
    public string? Phone { get; set; }

    public string? Address { get; set; }

   
}
