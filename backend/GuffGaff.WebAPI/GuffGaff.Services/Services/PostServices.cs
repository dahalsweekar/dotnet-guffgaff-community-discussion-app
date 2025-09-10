using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;

namespace GuffGaff.Services.Services
{
    public class PostServices : IPostServices
    {
        private IPostServices _postServices;
        public PostServices(IPostServices postServices)
        {
            _postServices = postServices;
        }

        public async Task<ResponseModel> SaveThoughtAsync(Post thought)
        {
            try
            {
                return new ResponseModel(true);
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, "[Failed]: " + ex.Message);
            }
        }
    }
}
