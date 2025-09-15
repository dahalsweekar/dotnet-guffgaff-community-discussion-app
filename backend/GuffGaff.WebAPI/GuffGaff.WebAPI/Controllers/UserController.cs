using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using WBpro.Services.Interfaces;

namespace GuffGaff.WebAPI.Controllers
{
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserServices _userServices;
        private readonly IJwtTokenHandler _jwtTokenHandler;
        public UserController(IUserServices userServices, IJwtTokenHandler jwtTokenHandler)
        {
            _userServices = userServices;
            _jwtTokenHandler = jwtTokenHandler;
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

        [HttpPost]
        [Route($"{apiHelper.Login}")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            try
            {
                var isValid = await _userServices.LoginAsync(user);
                if (isValid._isSuccess)
                {
                    var token = _jwtTokenHandler.GenerateToken(user.Email, "any");
                    return Ok(new { Token = token });
                }
                return Ok("Unauthorized Access");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.ValidateUser}")]
        public async Task<IActionResult> ValidateUser([FromBody] User user)
        {
            try
            {
                return Ok(await _userServices.ValidateUserAsync(user));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }
    }
}
