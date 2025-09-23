using GuffGaff.Database.DBContext;
using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

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
                Hasher hashPassword = new Hasher();
                user.Password = hashPassword.hashPassword(user.Password);
                var result = await _dbContext.Users.AddAsync(user);
                await _dbContext.SaveChangesAsync();

                return new ResponseModel(true);
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }

        public async Task<ResponseModelTask<User>> LoginAsync(User user)
        {
            try
            {
                var identity = await _dbContext.Users.Where(u => u.Email == user.Email).FirstOrDefaultAsync();
                if (identity != null)
                {
                    Hasher hashPassword = new Hasher();
                    var password = await _dbContext.Users.Where(x => x.Email == user.Email).Select(x => x.Password).FirstOrDefaultAsync();
                    bool isAuthSuccess = hashPassword.verifyPassword(password ?? "", user.Password);
                    if (isAuthSuccess)
                        return new ResponseModelTask<User>(new User() { Name = identity.Name, Password = password ?? "", Email = user.Email });
                    else
                        return new ResponseModelTask<User>(new User(), "Authentication Failed.");
                }
                return new ResponseModelTask<User>(new User(), "User does not exists.");

            }
            catch (Exception ex)
            {
                return new ResponseModelTask<User>(new User(), ex.Message);
            }
        }

        public async Task<ResponseModel> ValidateUserAsync(User user)
        {
            try
            {
                var identity = await _dbContext.Users.Where(u => u.Email == user.Email).FirstOrDefaultAsync();
                if (identity != null)
                {
                    return new ResponseModel(true, "Ja");
                }
                return new ResponseModel(true, "Nein");
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }
    }
}
