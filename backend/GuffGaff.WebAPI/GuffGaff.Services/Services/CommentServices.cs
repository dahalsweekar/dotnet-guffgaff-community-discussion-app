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
                reply.ReplyDate = DateTime.Now;
                var result = await _dbContext.Replies.AddAsync(reply);
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
    }
}
