namespace AdminWebGosy.Models
{
    public class Revenue
    {
        public decimal TotalMonth { get; set; }
        public decimal TotalDay { get; set; }
        public int TotalOrder { get; set; }

        public int? NewUser { get; set; }

        public List<DataChart> DataBarChart { get; set; }
        public Revenue() { }
       
    }
}
