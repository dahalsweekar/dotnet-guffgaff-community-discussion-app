using GuffGaff.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace GuffGaff.Database.DBContext
{
    public class GuffGaffDBContext : DbContext
    {
        public GuffGaffDBContext(DbContextOptions<GuffGaffDBContext> options) : base(options) { }

        public DbSet<Thought> Thoughts { get; set; }
    }
}
