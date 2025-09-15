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

        public async Task<ResponseModel> LoginAsync(User user)
        {
            try
            {
                bool isValidUser = await _dbContext.Users.Select(u => u.Email == user.Email).AnyAsync();
                if (isValidUser)
                {
                    Hasher hashPassword = new Hasher();
                    var password = await _dbContext.Users.Where(x => x.Email == user.Email).Select(x => x.Password).FirstOrDefaultAsync();
                    return new ResponseModel(hashPassword.verifyPassword(password ?? "", user.Password));
                }
                return new ResponseModel(false, "User does not exists.");

            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }

        public async Task<ResponseModel> ValidateUserAsync(User user)
        {
            try
            {
                bool userExists = await _dbContext.Users.Select(u => u.Email == user.Email).AnyAsync();
                if (userExists)
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
