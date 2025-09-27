using System.ComponentModel.DataAnnotations;

namespace GuffGaff.Database.Models
{
    public class Post
    {
        [Key]
        public Guid PostId { get; set; }
        public string Owner { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public int UpVotes { get; set; }
        public int DownVotes { get; set; }
        public int Comments { get; set; }
        public DateTime? PostedDate { get; set; }
        public bool? IsRemoved { get; set; }
        public bool? IsEdited { get; set; }
    }

    public class RankedPost
    {
        public Post Post { get; set; }
        public double Score { get; set; }
    }
}
