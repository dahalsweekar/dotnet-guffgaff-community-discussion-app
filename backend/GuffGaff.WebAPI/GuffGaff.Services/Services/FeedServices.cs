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
                var posts = await _dbContext.Posts
                            .Join(
                            _dbContext.Users,
                            post => post.Owner,
                            user => user.Email,
                            (post, user) => new Post
                            {
                                PostId = post.PostId,
                                Owner = post.Owner,
                                OwnerName = user.Name,
                                Title = post.Title,
                                Description = post.Description,
                                Category = post.Category,
                                UpVotes = post.UpVotes,
                                DownVotes = post.DownVotes,
                                Comments = post.Comments,
                                PostedDate = post.PostedDate,
                                IsRemoved = post.IsRemoved,
                                IsEdited = post.IsEdited
                            }).ToListAsync();
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
