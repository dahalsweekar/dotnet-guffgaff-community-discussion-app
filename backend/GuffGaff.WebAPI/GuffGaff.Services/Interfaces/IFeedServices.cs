using GuffGaff.Database.Models;

namespace GuffGaff.Services.Interfaces
{
    public interface IFeedServices
    {
        public Task<ResponseModelTask<List<Post>>> GetSavedPostsAsync();
    }
}
