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
            "ASP.NET Core, C#, SQL, Azure, JavaScript, CSS, HTML, Github";

        public static readonly List<ProjectVM> Projects = new()
        {

            new ProjectVM
            {
                Slug = "hsb-finspang-webbplats",
                Title = "HSB Finspång – Webbplats",
                Summary = "Examensprojekt under praktik 2025: system för hyresbostadsförening där boende bokar tvättstuga och andra resurser. Admin kan hantera faciliteter, nyheter, medlemmar, roller och tider. OBS: Källkoden är privat för skolan och kan inte delas offentligt.",
                HeroImage = "/img/BRFViggen/HomepageBRFViggen.png",
                Role = "Fullstack",
                Period = "2025",
                Techs = new[] { "ASP.NET Core", "EF Core", "SQL", "Identity", "JavaScript" },
                Bullets = new[]
                {
                    "Entity Framework Core med code-first migrationer",
                    "Identity med rollbaserad åtkomst (Admin/Användare)",
                    "Kalendersystem med bokningslogik",
                    "CRUD-hantering av nyheter, faciliteter och tider"
                },
                Gallery = new[]
                {
                    "/img/BRFViggen/HomepageBRFViggen.png",
                    "/img/BRFViggen/Bokningssystem.png"
                },
                RepoUrl = null,
                LiveUrl = "https://hsb2025.lexlink.se/"
            },

            new ProjectVM
            {
                Slug = "portfolio-2025",
                Title = "Portfolio",
                Summary = "Min nuvarande portfolio. Byggd med ASP.NET Core och automatiserad deploy via GitHub Actions till Fly.io.",
                HeroImage = "/img/Portfolio/pf1.png",
                Role = "Design & utveckling",
                Period = "2025",
                Techs = new [] { "ASP.NET Core", "JavaScript", "CSS", "HTML" },
                Bullets = new []
                {
                    "Responsiv layout med CSS Grid/Flexbox",
                    "Client-side effekter via JavaScript (IntersectionObserver, typing effect)",
                    "CI/CD pipeline med GitHub Actions",
                    "Deploy automatiserad till Fly.io"
                },
                Gallery = new []
                {
                    "/img/Portfolio/pf1.png",
                    "/img/Portfolio/pf2.png",
                    "/img/Portfolio/pf3.png"
                },
                RepoUrl = "https://github.com/HarotDev/Portfolio",
                LiveUrl = "https://tasmim.se"
            },

            new ProjectVM
            {
                Slug = "tasmim-webbyra",
                Title = "Tasmim – Webbyråsajt",
                Summary = "Fler-språkig webbyråsajt byggd i ASP.NET Core med CI/CD-flöde till Fly.io.",
                HeroImage = "/img/Tasmim/tasmim1.png",
                Role = "Frontend & integration",
                Period = "2025",
                Techs = new[] { "ASP.NET Core", "JavaScript", "CSS", "i18n" },
                Bullets = new[]
                {
                    "Flerspråksstöd (svenska/arabisk) med resx",
                    "Komponentbaserad layout för återanvändbara sektioner",
                    "Responsiv design anpassad för alla enheter",
                    "CI/CD med GitHub Actions → Fly.io"
                },
                Gallery = new[]
                {
                    "/img/Tasmim/tasmim1.png",
                    "/img/Tasmim/tasmim2.png",
                    "/img/Tasmim/tasmim3.png"
                },
                RepoUrl = "https://github.com/HarotDev/Tasmim.se",
                LiveUrl = "https://tasmim.se"
            },

            new ProjectVM
            {
                Slug = "karmasha-shopify",
                Title = "Karmasha – Shopify & Liquid",
                Summary = "Shopify-tema med egna Liquid-sektioner och blocks. Frontend fokus på UX, konvertering och prestanda.",
                HeroImage = "/img/Karmasha/karmasha1.png",
                Role = "Frontend/Theme",
                Period = "2024",
                Techs = new [] { "Shopify", "Liquid", "CSS", "UX/UI" },
                Bullets = new []
                {
                    "Custom Liquid-sektioner/blocks i Shopify",
                    "Responsiva sektioner med lazy loading",
                    "Flerspråkig konfiguration i Shopify",
                    "Optimerad prestanda och UX för e-handel"
                },
                Gallery = new []
                {
                    "/img/Karmasha/karmasha1.png",
                    "/img/Karmasha/karmasha2.png"
                },
                RepoUrl = null,
                LiveUrl = "https://karmasha.se"
            }
        };
    }
}
