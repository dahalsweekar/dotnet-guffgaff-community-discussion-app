using GuffGaff.Database.Models;

namespace GuffGaff.Services.Interfaces
{
    public interface IPostServices
    {
        public Task<ResponseModel> SavePostAsync(Post post);
        public Task<ResponseModelTask<Post>> GetPostAsync(Post post);
        public Task<ResponseModel> UpdateVoteAsync(Vote vote);
    }
}
