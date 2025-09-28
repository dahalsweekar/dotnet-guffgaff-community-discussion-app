using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace GuffGaff.Database.DBContext
{
    public class GuffGaffDbContextFactory : IDesignTimeDbContextFactory<GuffGaffDBContext>
    {
        public GuffGaffDBContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<GuffGaffDBContext>();
            var connectionString = config.GetConnectionString("PostGreSQlConnection");

            optionsBuilder.UseNpgsql(connectionString);

            return new GuffGaffDBContext(optionsBuilder.Options);
        }
    }
}
