using System.ComponentModel.DataAnnotations;

namespace GuffGaff.Database.Models
{
    public class Email
    {
        [Key]
        public int Id { get; set; }
        public string? fromEmail { get; set; }
        public string? ToEmail { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public string? otp { get; set; }

    }
}
