using Microsoft.EntityFrameworkCore;

namespace Portfolio.Data
{
    public class PortfolioContext : DbContext
    {
        public PortfolioContext(DbContextOptions<PortfolioContext> options) : base(options) { }

        public DbSet<Project> Projects => Set<Project>();
        public DbSet<ProjectTech> ProjectTechs => Set<ProjectTech>();
        public DbSet<ProjectBullet> ProjectBullets => Set<ProjectBullet>();
        public DbSet<ProjectImage> ProjectImages => Set<ProjectImage>();

        public DbSet<Experience> Experiences => Set<Experience>();
        public DbSet<ExperienceBullet> ExperienceBullets => Set<ExperienceBullet>();

        public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
        public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            // Unik slug
            b.Entity<Project>().HasIndex(p => p.Slug).IsUnique();

            // Enkel kaskad för barn
            b.Entity<Project>()
                .HasMany(p => p.Techs).WithOne(t => t.Project)
                .HasForeignKey(t => t.ProjectId).OnDelete(DeleteBehavior.Cascade);

            b.Entity<Project>()
                .HasMany(p => p.Bullets).WithOne(t => t.Project)
                .HasForeignKey(t => t.ProjectId).OnDelete(DeleteBehavior.Cascade);

            b.Entity<Project>()
                .HasMany(p => p.Gallery).WithOne(t => t.Project)
                .HasForeignKey(t => t.ProjectId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
