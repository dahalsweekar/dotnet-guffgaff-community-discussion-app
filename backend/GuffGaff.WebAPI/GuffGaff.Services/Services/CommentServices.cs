using GuffGaff.Database.DBContext;
using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GuffGaff.Services.Services
{
    public class CommentServices : ICommentServices
    {
        private GuffGaffDBContext _dbContext;

        public CommentServices(GuffGaffDBContext dBContext)
        {
            _dbContext = dBContext;
        }

        public async Task<ResponseModel> SaveCommentAsync(Comment comment)
        {
            try
            {
                comment.CommentDate = DateTime.Now;
                var result = await _dbContext.Comments.AddAsync(comment);
                var updatedCommentNo = await _dbContext.Posts.Where(x => x.PostId == Guid.Parse(comment.PostId)).FirstOrDefaultAsync();
                if (updatedCommentNo != null)
                    updatedCommentNo.Comments++;
                _dbContext.SaveChanges();
                return new ResponseModel(true, "Successfully saved.");
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }

        public async Task<ResponseModel> SaveReplyAsync(Reply reply)
        {
            try
            {
                reply.CommentDate = DateTime.Now;
                var result = await _dbContext.Replies.AddAsync(reply);
                var updatedCommentNo = await _dbContext.Posts.Where(x => x.PostId == Guid.Parse(reply.PostId)).FirstOrDefaultAsync();
                if (updatedCommentNo != null)
                    updatedCommentNo.Comments++;
                _dbContext.SaveChanges();
                return new ResponseModel(true, "Successfully saved.");
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }

        public async Task<ResponseModelTask<CommentReply>> GetCommentsAsync(Search post)
        {
            try
            {
                var comments = await _dbContext.Comments.Where(c => c.PostId == post.PostId).ToListAsync();
                var replies = await _dbContext.Replies.Where(r => r.PostId == post.PostId).ToListAsync();
                CommentReply cr = new CommentReply();
                cr.comments = comments;
                cr.replies = replies;
                return new ResponseModelTask<CommentReply>(cr);
            }
            catch (Exception ex)
            {
                return new ResponseModelTask<CommentReply>(new CommentReply(), "Failed");
            }
        }

        public async Task<ResponseModel> UpVoteCommentAsync(Vote vote)
        {
            try
            {
                var postId = Guid.Parse(Convert.ToString(vote.PostId));

                var votedComment = await _dbContext.Comments
                    .Where(x => x.CommentId == vote.CommentId && x.PostId == vote.PostId)
                    .FirstOrDefaultAsync();

                if (votedComment != null)
                {
                    vote.Owner = votedComment.UserId;

                    if (vote.UpVote)
                        votedComment.UpVotes++;
                    else
                        votedComment.DownVotes++;

                    await _dbContext.Votes.AddAsync(vote);
                    await _dbContext.SaveChangesAsync();
                    return new ResponseModel(true, "Success");
                }
                else
                {
                    var votedReply = await _dbContext.Replies
                    .Where(x => x.CommentId == vote.CommentId && x.PostId == vote.PostId)
                    .FirstOrDefaultAsync();

                    if (votedReply != null)
                    {
                        vote.Owner = votedReply.UserId;

                        if (vote.UpVote)
                            votedReply.UpVotes++;
                        else
                            votedReply.DownVotes++;

                        await _dbContext.Votes.AddAsync(vote);
                        await _dbContext.SaveChangesAsync();
                        return new ResponseModel(true, "Success");
                    }
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
