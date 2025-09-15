using System.ComponentModel.DataAnnotations;

namespace GuffGaff.Database.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Picture { get; set; }
        public string Password { get; set; }
    }
}
