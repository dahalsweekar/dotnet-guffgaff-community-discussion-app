using System.ComponentModel.DataAnnotations;

namespace GuffGaff.Database.Models
{
    public class Token
    {
        [Key]
        public int Id { get; set; }
        public string Email { get; set; }
        public string TokenNo { get; set; }
    }
}
