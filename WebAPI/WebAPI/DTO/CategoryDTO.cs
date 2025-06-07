namespace WebAPI.DTO
{
    public class CategoryDTO
    {
        public DateTime? CreatedAt { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; }
    }
}
