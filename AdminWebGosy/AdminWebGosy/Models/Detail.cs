using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Detail : BaseEntity
{
   
    public string? ScreenSize { get; set; }

    public string? ScreenTechnology { get; set; }

    public string? RearCamera { get; set; }

    public string? FrontCamera { get; set; }

    public string? Chipset { get; set; }

    public string? Gpu { get; set; }

    public string? Nfc { get; set; }

    public string? Ram { get; set; }

    public string? InternalStorage { get; set; }

    public string? Battery { get; set; }

    public string? Simcard { get; set; }

    public string? ScreenResolution { get; set; }

    public string? ChargingTechnology { get; set; }

    public int? ProductId { get; set; }
}
