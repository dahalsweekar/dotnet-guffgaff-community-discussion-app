using GuffGaff.Database.Models;

namespace GuffGaff.Services.Interfaces
{
    public interface IPostServices
    {
        public Task<ResponseModel> SaveThoughtAsync(Thought thought);
    }
}
