using GuffGaff.Database.DBContext;
using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GuffGaff.Services.Services
{
    public class FeedServices : IFeedServices
    {
        private GuffGaffDBContext _dbContext;
        private IMiscellaneous _miscellaneous;
        public FeedServices(GuffGaffDBContext dBContext, IMiscellaneous miscellaneous)
        {
            _dbContext = dBContext;
            _miscellaneous = miscellaneous;
        }

        public async Task<ResponseModelTask<List<Post>>> GetSavedPostsAsync()
        {
            try
            {
                List<Post> rankedPost = new List<Post>();
                var posts = await _dbContext.Posts.ToListAsync();
                if (posts.Count > 0)
                {
                    var rp = _miscellaneous.RankPosts(posts);
                    foreach (var post in rp)
                    {
                        rankedPost.Add(post.Post);
                    }
                }
                return new ResponseModelTask<List<Post>>(rankedPost);
            }
            catch (Exception ex)
            {
                return new ResponseModelTask<List<Post>>(new List<Post>(), ex.Message);
            }
        }
    }
}
