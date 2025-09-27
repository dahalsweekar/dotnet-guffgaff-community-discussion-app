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

        public async Task<ResponseModelTask<Post>> SavePostAsync(Post post)
        {
            try
            {
                post.PostedDate = DateTime.Now;
                post.IsEdited = false;
                post.IsRemoved = false;
                var result = await _dbContext.Posts.AddAsync(post);
                _dbContext.SaveChanges();
                return new ResponseModelTask<Post>(post);
            }
            catch (Exception ex)
            {
                return new ResponseModelTask<Post>(new Post(), "[Failed]: " + ex.Message);
            }
        }
        public async Task<ResponseModelTask<Post>> GetPostAsync(Search post)
        {
            try
            {
                var result = await _dbContext.Posts.Where(x => x.PostId == Guid.Parse(post.PostId ?? "")).OrderByDescending(x => x.PostedDate).FirstOrDefaultAsync();
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
                bool doContinue = true;

                var votedPost = await _dbContext.Posts
                    .Where(x => x.PostId == postId && x.IsRemoved == false)
                    .FirstOrDefaultAsync();

                if (votedPost != null)
                {
                    var alreadyVoted = await _dbContext.Votes.Where(x => x.PostId == vote.PostId && x.Voter == vote.Voter).FirstOrDefaultAsync();
                    if (alreadyVoted != null)
                    {
                        if (alreadyVoted.UpVote && vote.UpVote)
                        {
                            votedPost.UpVotes--;
                            doContinue = false;
                        }
                        else if (!alreadyVoted.UpVote && !vote.UpVote)
                        {
                            votedPost.DownVotes--;
                            doContinue = false;
                        }
                        else if (alreadyVoted.UpVote && !vote.UpVote)
                        {
                            votedPost.UpVotes--;
                        }
                        else
                        {
                            votedPost.DownVotes--;
                        }
                        _dbContext.Votes.Remove(alreadyVoted);
                    }
                    if (doContinue)
                    {
                        vote.Owner = votedPost.Owner;

                        if (vote.UpVote)
                            votedPost.UpVotes++;
                        else
                            votedPost.DownVotes++;

                        await _dbContext.Votes.AddAsync(vote);


                        Notification notice = new Notification();
                        notice.InitiatorId = vote.Voter;
                        notice.ActionPostId = vote.PostId;
                        notice.UserId = vote.Owner;
                        switch (vote.UpVote)
                        {
                            case true:
                                notice.ActionTaken = vote.Voter + " upvoted your post.";
                                break;
                            case false:
                                notice.ActionTaken = vote.Voter + " downvoted your post.";
                                break;
                        }
                        notice.ActionDate = DateTime.Now;
                        notice.IsReadByUser = false;

                        if (vote.Voter != notice.UserId)
                            await _dbContext.Notifications.AddAsync(notice);
                    }

                    await _dbContext.SaveChangesAsync();
                    return new ResponseModel(true, "Vote Successful.");
                }
                return new ResponseModel(true, "This post has already been removed.");
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, "[Failed]: " + ex.Message);
            }
        }

        public async Task<ResponseModelTask<List<Post>>> SearchPostAsync(Search searchKey)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchKey.SearchKey))
                {
                    return new ResponseModelTask<List<Post>>(new List<Post>());
                }

                var result = await _dbContext.Posts
                            .Where(p => p.Title.ToLower().Contains(searchKey.SearchKey ?? "") || p.Description.ToLower().Contains(searchKey.SearchKey ?? ""))
                            .ToListAsync();
                return new ResponseModelTask<List<Post>>(result);
            }
            catch (Exception ex)
            {
                return new ResponseModelTask<List<Post>>(new List<Post>(), ex.Message);
            }
        }

        public async Task<ResponseModel> DeletePostAsync(Post post)
        {
            try
            {
                var doesPostExist = await _dbContext.Posts.Where(x => x.PostId == post.PostId).FirstOrDefaultAsync();
                if (doesPostExist != null)
                {
                    if (doesPostExist.IsRemoved ?? false)
                    {
                        return new ResponseModel(true, "This post does not exist.");
                    }
                    else
                    {
                        doesPostExist.IsRemoved = true;
                        _dbContext.Posts.Update(doesPostExist);
                        await _dbContext.SaveChangesAsync();
                        return new ResponseModel(true, "Post is removed.");
                    }
                }

                return new ResponseModel(true, "This post does not exist.");
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }

        public async Task<ResponseModel> UpdatePostAsync(Post post)
        {
            try
            {
                var postToUpdate = await _dbContext.Posts.Where(x => x.PostId == post.PostId && x.IsRemoved != true).FirstOrDefaultAsync();
                if (postToUpdate != null)
                {
                    postToUpdate.Title = post.Title;
                    postToUpdate.Category = post.Category;
                    postToUpdate.Description = post.Description;
                    postToUpdate.PostedDate = DateTime.Now;
                    postToUpdate.IsEdited = true;

                    await _dbContext.SaveChangesAsync();

                    return new ResponseModel(true, "Post updated.");
                }

                return new ResponseModel(true, "This post is already removed.");

            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }
    }
}
