using GuffGaff.Database.Models;

namespace GuffGaff.Services.Interfaces
{
    public interface IMiscellaneous
    {
        public Task<List<ResponseModelTask<List<Post>>>> GetTrendingPosts();
        public Task<ResponseModelTask<List<string>>> GetCategories();
        public List<RankedPost> RankPosts(List<Post> posts);
    }
}
