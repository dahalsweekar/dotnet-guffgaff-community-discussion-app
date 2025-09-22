using System.ComponentModel.DataAnnotations;

namespace GuffGaff.Database.Models
{
    public class Vote
    {
        [Key]
        public int Id { get; set; }
        public string Owner { get; set; }
        public string Voter { get; set; }
        public string PostId { get; set; }
        public int? CommentId { get; set; }
        public bool UpVote { get; set; }
    }
}
