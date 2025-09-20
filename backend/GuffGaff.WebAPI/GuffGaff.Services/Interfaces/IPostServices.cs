using GuffGaff.Database.Models;

namespace GuffGaff.Services.Interfaces
{
    public interface IPostServices
    {
        public Task<ResponseModelTask<Post>> SavePostAsync(Post post);
        public Task<ResponseModelTask<Post>> GetPostAsync(Search post);
        public Task<ResponseModel> UpdateVoteAsync(Vote vote);
        public Task<ResponseModelTask<List<Post>>> SearchPostAsync(Search searchKey);
    }
}
