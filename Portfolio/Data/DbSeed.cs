using System.Linq;

namespace Portfolio.Data
{
    public class DbSeed
    {
        public static void Run(PortfolioContext db)
        {
            if (!db.SiteSettings.Any())
            {
                db.SiteSettings.Add(new SiteSetting
                {
                    AboutPhotoUrl = "/images/harot.jpg",
                    AboutText = "Full-stack utvecklare som gillar robust backend, ren arkitektur och pixelperfekt UI.",
                    TechStack = ".NET, C#, EF Core, SQL, Azure, JavaScript, GSAP/Canvas"
                });
            }

            if (!db.Projects.Any())
            {
                var p1 = new Project
                {
                    Slug = "brf-viggen",
                    Title = "BRF Viggen – Bokningssystem",
                    Summary = "Bokning av tvättstuga, resurskalender, roller/behörigheter, admin-verktyg.",
                    HeroImage = "/images/cases/viggen-hero.jpg",
                    Role = "Full-stack",
                    Period = "2024"
                };
                p1.Techs.AddRange(new[]{
                    new ProjectTech{ Name=".NET"},
                    new ProjectTech{ Name="EF Core"},
                    new ProjectTech{ Name="SQL"},
                    new ProjectTech{ Name="Identity"},
                    new ProjectTech{ Name="Azure"},
                });
                p1.Bullets.AddRange(new[]{
                    new ProjectBullet{ Text="Multi-tenant struktur"},
                    new ProjectBullet{ Text="SignalR-notiser vid bokning"},
                    new ProjectBullet{ Text="Admin med export/statistik"},
                });
                p1.Gallery.AddRange(new[]{
                    new ProjectImage{ Url="/images/cases/viggen-1.jpg"},
                    new ProjectImage{ Url="/images/cases/viggen-2.jpg"},
                });

                var p2 = new Project
                {
                    Slug = "karmasha-shopify",
                    Title = "Karmasha – Shopify & Liquid",
                    Summary = "Temaanpassning, hero-video, flerspråk och konvertering.",
                    HeroImage = "/images/cases/karmasha-hero.jpg",
                    Role = "Frontend/Theme",
                    Period = "2024"
                };
                p2.Techs.AddRange(new[]{
                    new ProjectTech{ Name="Liquid"},
                    new ProjectTech{ Name="JavaScript"},
                    new ProjectTech{ Name="UX"},
                });
                p2.Bullets.AddRange(new[]{
                    new ProjectBullet{ Text="Custom sektioner/blocks"},
                    new ProjectBullet{ Text="A/B-test av copy"},
                });
                p2.Gallery.Add(new ProjectImage { Url = "/images/cases/karmasha-1.jpg" });

                db.Projects.AddRange(p1, p2);
            }

            if (!db.Experiences.Any())
            {
                var e1 = new Experience { Title = "Systemutvecklare – Lexicon (.NET)", Period = "2024–2025" };
                e1.Bullets.Add(new ExperienceBullet { Text = "MVC, Identity (roller/claims), EF Core" });
                e1.Bullets.Add(new ExperienceBullet { Text = "Prestanda, migrations, CI/CD-grunder" });

                var e2 = new Experience { Title = "E-handel & varumärken – Karmasha m.fl.", Period = "Löpande" };
                e2.Bullets.Add(new ExperienceBullet { Text = "Shopify-teman, e-post flows, UX & copy" });

                db.Experiences.AddRange(e1, e2);
            }

            db.SaveChanges();
        }
    }
}
