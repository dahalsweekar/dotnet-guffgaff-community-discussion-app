using GuffGaff.Database.Models;

namespace GuffGaff.Services.Interfaces
{
    public interface IUserServices
    {
        public Task<ResponseModel> SaveUserDetails(User user);
        public Task<ResponseModelTask<User>> LoginAsync(User user);
        public Task<ResponseModel> ValidateUserAsync(User user);
        public Task<ResponseModel> ValidateUserNameAsync(User user);
    }
}
