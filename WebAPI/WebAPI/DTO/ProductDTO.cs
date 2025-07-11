namespace WebAPI.DTO
{
    public class ProductDTO
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Unit { get; set; }
        public int CategoryId { get; set; }
        public int Rate { get; set; }
        public int Sold { get; set; }
        public string Brand { get; set; }
        public int Promo { get; set; }

        public int Banner { get; set; }
        public int? StarsRate { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
