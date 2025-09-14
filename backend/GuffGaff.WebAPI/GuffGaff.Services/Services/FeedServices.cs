using GuffGaff.Database.DBContext;
using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GuffGaff.Services.Services
{
    public class FeedServices : IFeedServices
    {
        private GuffGaffDBContext _dbContext;
        public FeedServices(GuffGaffDBContext dBContext)
        {
            _dbContext = dBContext;
        }

        public async Task<ResponseModelTask<List<Post>>> GetSavedPostsAsync()
        {
            try
            {
                var posts = await _dbContext.Posts.ToListAsync();
                return new ResponseModelTask<List<Post>>(posts);
            }
            catch (Exception ex)
            {
                return new ResponseModelTask<List<Post>>(new List<Post>(), ex.Message);
            }
        }
    }
}
