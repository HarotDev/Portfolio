using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Portfolio.Data
{
    public class Project
    {
        public int Id { get; set; }

        [Required, MaxLength(160)]
        public string Slug { get; set; } = "";

        [Required, MaxLength(160)]
        public string Title { get; set; } = "";

        [MaxLength(600)]
        public string? Summary { get; set; }

        [MaxLength(260)]
        public string? HeroImage { get; set; }

        [MaxLength(100)]
        public string? Role { get; set; }

        [MaxLength(40)]
        public string? Period { get; set; }

        [MaxLength(260)]
        public string? RepoUrl { get; set; }

        [MaxLength(260)]
        public string? LiveUrl { get; set; }

        public List<ProjectTech> Techs { get; set; } = new();
        public List<ProjectBullet> Bullets { get; set; } = new();
        public List<ProjectImage> Gallery { get; set; } = new();
    }

    public class ProjectTech
    {
        public int Id { get; set; }
        [Required, MaxLength(40)]
        public string Name { get; set; } = "";
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }

    public class ProjectBullet
    {
        public int Id { get; set; }
        [Required, MaxLength(220)]
        public string Text { get; set; } = "";
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }

    public class ProjectImage
    {
        public int Id { get; set; }
        [Required, MaxLength(260)]
        public string Url { get; set; } = "";
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }

    public class Experience
    {
        public int Id { get; set; }

        [Required, MaxLength(160)]
        public string Title { get; set; } = "";

        [MaxLength(40)]
        public string? Period { get; set; }

        public List<ExperienceBullet> Bullets { get; set; } = new();
    }

    public class ExperienceBullet
    {
        public int Id { get; set; }
        [Required, MaxLength(180)]
        public string Text { get; set; } = "";
        public int ExperienceId { get; set; }
        public Experience Experience { get; set; } = null!;
    }

    public class SiteSetting
    {
        public int Id { get; set; }
        [MaxLength(260)]
        public string? AboutPhotoUrl { get; set; }
        [MaxLength(1200)]
        public string? AboutText { get; set; }
        [MaxLength(400)]
        public string? TechStack { get; set; }
    }

    public class ContactMessage
    {
        public int Id { get; set; }
        [Required, MaxLength(120)]
        public string Name { get; set; } = "";
        [Required, MaxLength(160), EmailAddress]
        public string Email { get; set; } = "";
        [Required, MaxLength(1000)]
        public string Message { get; set; } = "";
        public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
    }
}
