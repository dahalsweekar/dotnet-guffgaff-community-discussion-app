using GuffGaff.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace GuffGaff.Database.DBContext
{
    public class GuffGaffDBContext : DbContext
    {
        public GuffGaffDBContext(DbContextOptions<GuffGaffDBContext> options) : base(options) { }

        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Reply> Replies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<Token> Tokens { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>()
                .Property(p => p.PostId)
                .HasDefaultValueSql("NEWSEQUENTIALID()"); // Use SQL to generate GUIDs
        }
    }
}
