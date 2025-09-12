using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Models;
using System.Linq;
using Portfolio.Content;
using System.Threading.Tasks;

namespace YourApp.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            var projects = StaticContent.Projects
                .OrderByDescending(p => p.Period)
                .Select(p => new ProjectCardVM
                {
                    Slug = p.Slug,
                    Title = p.Title,
                    Summary = p.Summary,
                    Techs = p.Techs?.Take(6).ToList() ?? new List<string>()
                })
                .ToList();

            var vm = new HomeIndexVM
            {
                Projects = projects,
                Experiences = new(),
                AboutText = StaticContent.AboutText,
                AboutPhotoUrl = StaticContent.AboutPhotoUrl,
                TechStack = StaticContent.TechStack
            };

            ViewData["Title"] = "Portfolio – Harot Aziz";
            return View(vm);
        }

        [Route("project/{slug}")]
        public IActionResult Project(string slug)
        {
            var vm = StaticContent.Projects.FirstOrDefault(p => p.Slug == slug);
            if (vm == null) return NotFound();

            ViewData["Title"] = vm.Title + " – Case";
            return View(vm);
        }
    }
}
