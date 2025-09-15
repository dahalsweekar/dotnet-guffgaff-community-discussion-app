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
        public DbSet<Token> Tokens { get; set; }
    }
}
