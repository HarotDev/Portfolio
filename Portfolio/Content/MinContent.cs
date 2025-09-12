using Portfolio.Models;
using System.Collections.Generic;

namespace Portfolio.Content
{
    public static class StaticContent
    {
        public static string? AboutPhotoUrl => "/images/harot.jpg";
        public static string? AboutText =>
            "Fullstack-utvecklare inom ASP.NET Core/JavaScript som gillar tydliga gränssnitt, moderna lösningar och detaljer som känns.";
        public static string? TechStack =>
            "ASP.NET Core, C#, EF Core, SQL, Azure, JavaScript, Canvas";

        public static readonly List<ProjectVM> Projects = new()
        {
            new ProjectVM
            {
                Slug = "brf-viggen",
                Title = "BRF Viggen – Bokningssystem",
                Summary = "Bokning av tvättstuga, resurskalender, roller/behörigheter och admin-verktyg.",
                HeroImage = "/images/cases/viggen-hero.jpg",
                Role = "Full-stack",
                Period = "2024",
                Techs = new [] { "ASP.NET Core", "EF Core", "SQL", "Identity", "Azure", "JavaScript" },
                Bullets = new []
                {
                    "Multi-tenant struktur",
                    "SignalR-notiser vid bokning",
                    "Admin med export/statistik"
                },
                Gallery = new []
                {
                    "/images/cases/viggen-1.jpg",
                    "/images/cases/viggen-2.jpg"
                },
                RepoUrl = "https://github.com/harot/viggen",
                LiveUrl = "https://viggen.example.com"
            },

            new ProjectVM
            {
                Slug = "karmasha-shopify",
                Title = "Karmasha – Shopify & Liquid",
                Summary = "Temaanpassning, hero-video, flerspråk och konvertering.",
                HeroImage = "/images/cases/karmasha-hero.jpg",
                Role = "Frontend/Theme",
                Period = "2024",
                Techs = new [] { "Liquid", "JavaScript", "UX" },
                Bullets = new []
                {
                    "Custom sektioner/blocks",
                    "A/B-test av copy"
                },
                Gallery = new []
                {
                    "/images/cases/karmasha-1.jpg"
                },
                RepoUrl = "https://github.com/harot/karmasha",
                LiveUrl = "https://karmasha.example.com"
            },

            new ProjectVM
            {
                Slug = "portfolio-2025",
                Title = "Portfolio – 3D-känsla & glas",
                Summary = "Min nuvarande portfolio med tilt/glare, smooth slide-up och glas-navigering.",
                HeroImage = "/images/cases/portfolio-hero.jpg",
                Role = "Design & utveckling",
                Period = "2025",
                Techs = new [] { "ASP.NET Core", "JavaScript", "Canvas", "UX" },
                Bullets = new []
                {
                    "Custom IntersectionObserver för mjuka sektioner",
                    "Tillgänglighetsanpassad typningseffekt"
                },
                Gallery = new []
                {
                    "/images/cases/portfolio-1.jpg",
                    "/images/cases/portfolio-2.jpg"
                },
                RepoUrl = "https://github.com/harot/portfolio-2025",
                LiveUrl = "https://harot.example.com"
            }
        };
    }
}
