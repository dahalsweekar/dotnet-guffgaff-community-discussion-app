namespace GuffGaff.Database.Models
{
    public class Vote
    {
        public string Owner { get; set; }
        public string Voter { get; set; }
        public string PostId { get; set; }
        public bool UpVote { get; set; }
    }
}
