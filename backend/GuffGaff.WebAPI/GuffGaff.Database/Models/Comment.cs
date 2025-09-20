using System.ComponentModel.DataAnnotations;

namespace GuffGaff.Database.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        public int CommentId { get; set; }
        public string PostId { get; set; }
        public string UserId { get; set; }
        public string CommentDescription { get; set; }
        public int UpVotes { get; set; }
        public int DownVotes { get; set; }
        public int? ParentId { get; set; }
        public DateTime? CommentDate { get; set; }
    }

    public class CommentReply
    {
        public List<Comment> comments { get; set; }
        public List<Reply> replies { get; set; }
    }
}
