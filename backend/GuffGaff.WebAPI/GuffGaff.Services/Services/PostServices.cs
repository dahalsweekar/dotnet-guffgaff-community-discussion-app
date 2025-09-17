using GuffGaff.Database.DBContext;
using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GuffGaff.Services.Services
{
    public class PostServices : IPostServices
    {
        private GuffGaffDBContext _dbContext;
        public PostServices(GuffGaffDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ResponseModel> SavePostAsync(Post post)
        {
            try
            {
                post.PostedDate = DateTime.Now;
                var result = await _dbContext.Posts.AddAsync(post);
                _dbContext.SaveChanges();
                return new ResponseModel(true);
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, "[Failed]: " + ex.Message);
            }
        }
        public async Task<ResponseModelTask<Post>> GetPostAsync(Post post)
        {
            try
            {
                var result = await _dbContext.Posts.Where(x => x.PostId == post.PostId).FirstOrDefaultAsync();
                if (result == null)
                    return new ResponseModelTask<Post>(new Post());
                return new ResponseModelTask<Post>(result);
            }
            catch (Exception ex)
            {
                return new ResponseModelTask<Post>(new Post(), "[Failed]: " + ex.Message);
            }
        }

        public async Task<ResponseModel> UpdateVoteAsync(Vote vote)
        {
            try
            {
                var postId = Guid.Parse(Convert.ToString(vote.PostId));

                var votedPost = await _dbContext.Posts
                    .Where(x => x.PostId == postId)
                    .FirstOrDefaultAsync();

                if (votedPost != null)
                {
                    if (vote.UpVote)
                        votedPost.UpVotes++;
                    else
                        votedPost.DownVotes++;

                    await _dbContext.SaveChangesAsync();
                    return new ResponseModel(true, "Success");
                }
                return new ResponseModel(true, "No post found.");
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, "[Failed]: " + ex.Message);
            }
        }
    }
}
