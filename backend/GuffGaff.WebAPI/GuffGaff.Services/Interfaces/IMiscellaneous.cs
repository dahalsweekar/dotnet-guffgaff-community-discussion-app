using GuffGaff.Database.Models;

namespace GuffGaff.Services.Interfaces
{
    public interface IMiscellaneous
    {
        public Task<List<ResponseModelTask<List<Post>>>> GetTrendingPosts();
        public Task<ResponseModelTask<List<string>>> GetCategories();
        public List<RankedPost> RankPosts(List<Post> posts);
        public Task<ResponseModelTask<List<Notification>>> CheckNotifications(User user);
        public Task<ResponseModel> UpdateNotificationStatus(Notification notice);
        public Task<ResponseModel> SendEmailAsync(Email email);
        public Task<ResponseModel> VerifyOTPAsync(Email otp);
        public Task<ResponseModel> SetNewPassword(User user);
    }
}
