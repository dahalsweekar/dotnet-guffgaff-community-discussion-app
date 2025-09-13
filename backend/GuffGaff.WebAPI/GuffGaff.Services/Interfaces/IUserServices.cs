using GuffGaff.Database.Models;

namespace GuffGaff.Services.Interfaces
{
    public interface IUserServices
    {
        public Task<ResponseModel> SaveUserDetails(User user);
    }
}
