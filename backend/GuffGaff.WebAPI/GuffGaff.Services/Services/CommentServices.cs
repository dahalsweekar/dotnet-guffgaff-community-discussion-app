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
                comment.IsEdited = false;
                comment.IsRemoved = false;
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
                reply.IsRemoved = false;
                reply.IsEdited = false;
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
                bool doContinue = true;

                var votedComment = await _dbContext.Comments
                    .Where(x => x.CommentId == vote.CommentId && x.PostId == vote.PostId)
                    .FirstOrDefaultAsync();

                if (votedComment != null)
                {
                    var alreadyVoted = await _dbContext.Votes.Where(x => x.PostId == vote.PostId && x.Voter == vote.Voter && x.CommentId == vote.CommentId).FirstOrDefaultAsync();
                    if (alreadyVoted != null)
                    {
                        if (alreadyVoted.UpVote && vote.UpVote)
                        {
                            votedComment.UpVotes--;
                            doContinue = false;
                        }
                        else if (!alreadyVoted.UpVote && !vote.UpVote)
                        {
                            votedComment.DownVotes--;
                            doContinue = false;
                        }
                        else if (alreadyVoted.UpVote && !vote.UpVote)
                        {
                            votedComment.UpVotes--;
                        }
                        else
                        {
                            votedComment.DownVotes--;
                        }
                        _dbContext.Votes.Remove(alreadyVoted);
                    }

                    if (doContinue)
                    {
                        vote.Owner = votedComment.UserId;

                        if (vote.UpVote)
                            votedComment.UpVotes++;
                        else
                            votedComment.DownVotes++;

                        await _dbContext.Votes.AddAsync(vote);
                    }

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

                        var alreadyVoted = await _dbContext.Votes.Where(x => x.PostId == vote.PostId && x.Voter == vote.Voter && x.Owner == vote.Owner && x.CommentId == vote.CommentId).FirstOrDefaultAsync();
                        if (alreadyVoted != null)
                        {
                            if (alreadyVoted.UpVote && vote.UpVote)
                            {
                                votedReply.UpVotes--;
                            }
                            else if (!alreadyVoted.UpVote && !vote.UpVote)
                            {
                                votedReply.DownVotes--;
                            }
                            else if (alreadyVoted.UpVote && !vote.UpVote)
                            {
                                votedReply.UpVotes--;
                                doContinue = true;
                            }
                            else
                            {
                                votedReply.DownVotes--;
                                doContinue = true;
                            }
                            _dbContext.Votes.Remove(alreadyVoted);
                        }
                        if (doContinue)
                        {
                            vote.Owner = votedReply.UserId;

                            if (vote.UpVote)
                                votedReply.UpVotes++;
                            else
                                votedReply.DownVotes++;

                            await _dbContext.Votes.AddAsync(vote);
                        }

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

        public async Task<ResponseModel> DeleteCommentAsync(Comment comment)
        {
            try
            {
                var doesCommentExist = await _dbContext.Comments.Where(x => x.PostId == comment.PostId && x.CommentId == comment.CommentId).FirstOrDefaultAsync();
                if (doesCommentExist != null)
                {
                    if (doesCommentExist.IsRemoved ?? false)
                    {
                        return new ResponseModel(true, "This post does not exist.");
                    }
                    else
                    {
                        doesCommentExist.IsRemoved = true;
                        _dbContext.Comments.Update(doesCommentExist);
                        await _dbContext.SaveChangesAsync();
                        return new ResponseModel(true, "Post is removed.");
                    }
                }
                else
                {
                    var doesReplyExist = await _dbContext.Replies.Where(x => x.PostId == comment.PostId && x.CommentId == comment.CommentId).FirstOrDefaultAsync();
                    if (doesReplyExist != null)
                    {
                        if (doesReplyExist.IsRemoved ?? false)
                        {
                            return new ResponseModel(true, "This response does not exist.");
                        }
                        else
                        {
                            doesReplyExist.IsRemoved = true;
                            _dbContext.Replies.Update(doesReplyExist);
                            await _dbContext.SaveChangesAsync();
                            return new ResponseModel(true, "Reponse is removed.");
                        }
                    }

                    return new ResponseModel(true, "This repsonse does not exist.");
                }
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }

        public async Task<ResponseModel> UpdateCommentAsync(Comment comment)
        {
            try
            {
                var commentToUpdate = await _dbContext.Comments.Where(x => x.PostId == comment.PostId && x.CommentId == comment.CommentId && x.IsRemoved != true).FirstOrDefaultAsync();
                if (commentToUpdate != null)
                {
                    commentToUpdate.CommentDescription = comment.CommentDescription;
                    commentToUpdate.CommentDate = DateTime.Now;
                    commentToUpdate.IsEdited = true;
                    commentToUpdate.IsRemoved = false;

                    await _dbContext.SaveChangesAsync();

                    return new ResponseModel(true, "Comment updated.");
                }
                else
                {
                    var replyToUpdate = await _dbContext.Replies.Where(x => x.PostId == comment.PostId && x.CommentId == comment.CommentId && x.IsRemoved != true).FirstOrDefaultAsync();
                    if (replyToUpdate != null)
                    {
                        replyToUpdate.CommentDescription = comment.CommentDescription;
                        replyToUpdate.CommentDate = DateTime.Now;
                        replyToUpdate.IsEdited = true;
                        replyToUpdate.IsRemoved = false;

                        await _dbContext.SaveChangesAsync();

                        return new ResponseModel(true, "Comment updated.");
                    }
                }

                return new ResponseModel(true, "This comment is already removed.");

            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }
    }
}
