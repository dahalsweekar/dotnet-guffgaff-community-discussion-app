using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuffGaff.WebAPI.Controllers
{
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserServices _userServices;
        public UserController(IUserServices userServices)
        {
            _userServices = userServices;
        }

        [HttpPost]
        [Route($"{apiHelper.SaveUserDetailsAPI}")]
        public async Task<IActionResult> SaveUserDetailsAsync([FromBody] User user)
        {
            try
            {
                return Ok(await _userServices.SaveUserDetails(user));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }
    }
}
