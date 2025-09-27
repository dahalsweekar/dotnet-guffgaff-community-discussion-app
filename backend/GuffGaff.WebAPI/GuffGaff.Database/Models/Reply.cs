using System.ComponentModel.DataAnnotations;

namespace GuffGaff.Database.Models
{
    public class Reply
    {
        [Key]
        public int Id { get; set; }
        public int CommentId { get; set; }
        public string PostId { get; set; }
        public string UserId { get; set; }
        public string CommentDescription { get; set; }
        public int UpVotes { get; set; }
        public int DownVotes { get; set; }
        public int ParentId { get; set; }
        public DateTime CommentDate { get; set; }
        public bool? IsRemoved { get; set; }
        public bool? IsEdited { get; set; }
    }
}
