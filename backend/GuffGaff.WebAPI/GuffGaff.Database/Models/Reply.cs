using System.ComponentModel.DataAnnotations;

namespace GuffGaff.Database.Models
{
    public class Reply
    {
        [Key]
        public int CommentId { get; set; }
        public int PostId { get; set; }
        public string UserId { get; set; }
        public string CommentDescription { get; set; }
        public int UpVotes { get; set; }
        public int DownVotes { get; set; }
        public int parentId { get; set; }
        public DateTime ReplyDate { get; set; }
    }
}
