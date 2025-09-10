using System.Collections.Generic;


namespace Portfolio.Models
{
    public class HomeIndexVM
    {
        public List<ProjectCardVM> Projects { get; set; } = new();
        public List<ExperienceVM> Experiences { get; set; } = new();
        public string? AboutText { get; set; }
        public string? AboutPhotoUrl { get; set; }
        public string? TechStack { get; set; }
    }

    public class ProjectCardVM
    {
        public string Slug { get; set; } = "";
        public string Title { get; set; } = "";
        public string? Summary { get; set; }
        public List<string> Techs { get; set; } = new();
    }

    public class ExperienceVM
    {
        public string Title { get; set; } = "";
        public string? Period { get; set; }
        public List<string> Bullets { get; set; } = new();
    }

    public class ProjectVM
    {
        public string Slug { get; set; } = "";
        public string Title { get; set; } = "";
        public string? Summary { get; set; }
        public string? HeroImage { get; set; }
        public string? Role { get; set; }
        public string? Period { get; set; }
        public IEnumerable<string> Techs { get; set; } = new List<string>();
        public IEnumerable<string> Bullets { get; set; } = new List<string>();
        public IEnumerable<string> Gallery { get; set; } = new List<string>();
        public string? RepoUrl { get; set; }
        public string? LiveUrl { get; set; }
    }
}
