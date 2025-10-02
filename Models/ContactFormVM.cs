using System.ComponentModel.DataAnnotations;

namespace Portfolio.Models
{
    public class ContactFormVM
    {
        [Required, StringLength(100)]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        [Required, StringLength(4000)]
        public string Message { get; set; }
    }
}
