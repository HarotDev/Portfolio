using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Content;
using Portfolio.Models;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace YourApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly IConfiguration _cfg;
        public HomeController(IConfiguration cfg) => _cfg = cfg;
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

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Contact(ContactFormVM form, [FromServices] IConfiguration cfg)
        {
            if (!ModelState.IsValid)
            {
                if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                {
                    var errors = ModelState
                        .Where(kv => kv.Value?.Errors.Count > 0)
                        .ToDictionary(kv => kv.Key, kv => kv.Value!.Errors.Select(e => e.ErrorMessage).ToArray());
                    return BadRequest(new { ok = false, errors });
                }
                TempData["ContactOk"] = false;
                return RedirectToAction("Index", "Home", new { anchor = "contact" });
            }

            string Clean(string s) => (s ?? "").Replace("\r", "").Replace("\n", "").Trim();
            var name = Clean(form.Name);
            var email = Clean(form.Email);
            var phone = (form.Phone ?? "").Trim();
            var msg = (form.Message ?? "").Trim();

            var body = $@"Namn: {name}
E-post: {email}
Telefon: {phone}
Meddelande:
{msg}";

            var smtpHost = cfg["Mail:ICloud:SmtpHost"] ?? "smtp.mail.me.com";
            var smtpPort = int.TryParse(cfg["Mail:ICloud:Port"], out var p) ? p : 587;
            var smtpUser = cfg["Mail:ICloud:User"] ?? "harotaziz@icloud.com";
            var appPassword = cfg["Mail:ICloud:AppPassword"];                    // Lösenordet hämtas från User secrets

            if (string.IsNullOrWhiteSpace(appPassword))
            {
                if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                    return StatusCode(500, new { ok = false, server = "Servern saknar e-postkonfiguration." });

                TempData["ContactOk"] = false;
                return RedirectToAction("Index", "Home", new { anchor = "contact" });
            }

            try
            {
                using var mail = new MailMessage
                {
                    From = new MailAddress(smtpUser, "Portfolio"),
                    Subject = $"Kontakt från {name}",
                    Body = body,
                    IsBodyHtml = false
                };
                mail.To.Add("harotaziz@icloud.com");
                if (!string.IsNullOrWhiteSpace(email))
                    mail.ReplyToList.Add(new MailAddress(email, name));

                using var smtp = new SmtpClient(smtpHost, smtpPort)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(smtpUser, appPassword)
                };

                await smtp.SendMailAsync(mail);

                if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                    return Json(new { ok = true });

                TempData["ContactOk"] = true;
                return RedirectToAction("Index", "Home", new { anchor = "contact" });
            }
            catch
            {
                if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                    return StatusCode(500, new { ok = false, server = "E-postfel (SMTP). Försök igen senare." });

                TempData["ContactOk"] = false;
                return RedirectToAction("Index", "Home", new { anchor = "contact" });
            }
        }

    }
}