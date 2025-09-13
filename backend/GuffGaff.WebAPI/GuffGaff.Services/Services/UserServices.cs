using GuffGaff.Database.DBContext;
using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;

namespace GuffGaff.Services.Services
{
    public class UserServices : IUserServices
    {
        private GuffGaffDBContext _dbContext;

        public UserServices(GuffGaffDBContext dBContext)
        {
            _dbContext = dBContext;
        }

        public async Task<ResponseModel> SaveUserDetails(User user)
        {
            try
            {
                bool DoesUserExists = _dbContext.Users.Select(u => u.Email == user.Email).FirstOrDefault();
                if (!DoesUserExists)
                {
                    var result = await _dbContext.Users.AddAsync(user);
                    await _dbContext.SaveChangesAsync();
                }
                return new ResponseModel(true);
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }
    }
}
