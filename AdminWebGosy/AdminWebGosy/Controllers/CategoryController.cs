using Microsoft.AspNetCore.Mvc;

namespace AdminWebGosy.Controllers
{
    public class CategoryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
