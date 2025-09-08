namespace GuffGaff.Database.Models
{
    public class Thought
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string ThoughtText { get; set; }
        public DateTime PostedDate { get; set; }
    }
}
