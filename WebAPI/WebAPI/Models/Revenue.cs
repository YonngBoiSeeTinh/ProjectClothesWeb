namespace WebAPI.Models
{
    public class Revenue
    {

        public decimal TotalMonth { get; set; }
        public decimal TotalDay { get; set; }
        public int TotalOrder { get; set; }

        public Revenue(decimal totalMonth, decimal totalDay, int totalOrder)
        {
            TotalMonth = totalMonth;
            TotalDay = totalDay;
            TotalOrder = totalOrder;
        }
    }
}
