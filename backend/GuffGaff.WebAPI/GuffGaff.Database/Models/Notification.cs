using System.ComponentModel.DataAnnotations;

namespace GuffGaff.Database.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }
        public string ActionPostId { get; set; }
        public string UserId { get; set; }
        public string InitiatorId { get; set; }
        public int? ActionCommentId { get; set; }
        public string ActionTaken { get; set; }
        public DateTime? ActionDate { get; set; }
        public bool? IsReadByUser { get; set; }
    }
}
