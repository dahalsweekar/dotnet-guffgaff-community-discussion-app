using GuffGaff.Database.Models;

namespace GuffGaff.Services.Interfaces
{
    public interface ICommentServices
    {
        public Task<ResponseModel> SaveCommentAsync(Comment comment);
        public Task<ResponseModel> SaveReplyAsync(Reply reply);
        public Task<ResponseModelTask<CommentReply>> GetCommentsAsync(int postId);
    }
}
