namespace GuffGaff.Database.Models
{
    public class Search
    {
        public string? PostId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? PostedDate { get; set; }
        public string? SearchKey { get; set; }
    }
}
