namespace WebAPI.DTO
{
    public class PostDTO
    {
        public DateTime? CreatedAt { get; set; }
        public string Type { get; set; }

        public string? Authur { get; set; }

        public string Content { get; set; }

        public string? Question { get; set; }
        public string? Title { get; set; }

    }
}
