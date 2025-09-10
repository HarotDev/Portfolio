using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Data;
using Portfolio.Models;
using System.Linq;
using System.Threading.Tasks;

namespace YourApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly PortfolioContext _db;
        public HomeController(PortfolioContext db) { _db = db; }

        public async Task<IActionResult> Index()
        {
            var s = await _db.SiteSettings.AsNoTracking().FirstOrDefaultAsync();

            var projects = await _db.Projects
                .AsNoTracking()
                .OrderByDescending(p => p.Id)
                .Select(p => new ProjectCardVM
                {
                    Slug = p.Slug,
                    Title = p.Title,
                    Summary = p.Summary,
                    Techs = p.Techs.Select(t => t.Name).ToList()
                })
                .ToListAsync();

            var exps = await _db.Experiences
                .AsNoTracking()
                .OrderByDescending(e => e.Id)
                .Select(e => new ExperienceVM
                {
                    Title = e.Title,
                    Period = e.Period,
                    Bullets = e.Bullets.Select(b => b.Text).ToList()
                })
                .ToListAsync();

            var vm = new HomeIndexVM
            {
                Projects = projects,
                Experiences = exps,
                AboutText = s?.AboutText,
                AboutPhotoUrl = s?.AboutPhotoUrl,
                TechStack = s?.TechStack
            };
            ViewData["Title"] = "Portfolio – Harot Aziz";
            return View(vm);
        }

        [Route("project/{slug}")]
        public async Task<IActionResult> Project(string slug)
        {
            var vm = await _db.Projects.AsNoTracking()
                .Where(p => p.Slug == slug)
                .Select(p => new ProjectVM
                {
                    Slug = p.Slug,
                    Title = p.Title,
                    Summary = p.Summary,
                    HeroImage = p.HeroImage,
                    Role = p.Role,
                    Period = p.Period,
                    Techs = p.Techs.Select(t => t.Name),
                    Bullets = p.Bullets.Select(b => b.Text),
                    Gallery = p.Gallery.Select(g => g.Url),
                    RepoUrl = p.RepoUrl,
                    LiveUrl = p.LiveUrl
                })
                .FirstOrDefaultAsync();

            if (vm == null) return NotFound();
            ViewData["Title"] = vm.Title + " – Case";
            return View(vm);
        }

        [HttpPost]
        public async Task<IActionResult> Contact([FromForm] string name, [FromForm] string email, [FromForm] string message)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(message))
                return BadRequest("Alla fält krävs.");

            _db.ContactMessages.Add(new ContactMessage { Name = name, Email = email, Message = message });
            await _db.SaveChangesAsync();
            return Ok(new { ok = true });
        }
    }
}
