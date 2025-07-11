namespace WebAPI.Models
{
    public class DataChart
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal Total { get; set; }

        public DataChart(int month, int year, decimal total)
        {
            Month = month;
            Year = year;
            Total = total;
        }
    }
}
