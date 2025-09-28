using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuffGaff.WebAPI.Controllers
{
    public class MiscellaneousController : Controller
    {
        private readonly IMiscellaneous _miscellaneous;
        public MiscellaneousController(IMiscellaneous miscellaneous)
        {
            _miscellaneous = miscellaneous;
        }

        [HttpPost]
        [Route($"{apiHelper.GetCategoriesAPI}")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                return Ok(await _miscellaneous.GetCategories());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.GetTrendingPostsAPI}")]
        public async Task<IActionResult> GetTrendingPosts()
        {
            try
            {
                return Ok(await _miscellaneous.GetTrendingPosts());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.CheckNotifications}")]
        public async Task<IActionResult> CheckNotifications([FromBody] User user)
        {
            try
            {
                return Ok(await _miscellaneous.CheckNotifications(user));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.UpdateNotificationStatus}")]
        public async Task<IActionResult> UpdateNotificationStatus([FromBody] Notification notice)
        {
            try
            {
                return Ok(await _miscellaneous.UpdateNotificationStatus(notice));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.SendEmail}")]
        public async Task<IActionResult> SendEmail([FromBody] Email request)
        {
            try
            {
                return Ok(await _miscellaneous.SendEmailAsync(request));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.VerifyOTP}")]
        public async Task<IActionResult> VerifyOTP([FromBody] Email otp)
        {
            try
            {
                return Ok(await _miscellaneous.VerifyOTPAsync(otp));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.SaveNewPassword}")]
        public async Task<IActionResult> SaveNewPassword([FromBody] User user)
        {
            try
            {
                return Ok(await _miscellaneous.SetNewPassword(user));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.GenerateTokenAPI}")]
        public async Task<IActionResult> GenerateTokenAsync([FromBody] User user)
        {
            try
            {
                return Ok(await _miscellaneous.GenerateTokenAsync(user));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.DeleteTokens}")]
        public async Task<IActionResult> DeleteTokensAsync([FromBody] User user)
        {
            try
            {
                return Ok(await _miscellaneous.DeleteTokenAsync(user));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.GetUserIDfromToken}")]
        public async Task<IActionResult> GetUserIDfromTokenAsync([FromBody] Token token)
        {
            try
            {
                return Ok(await _miscellaneous.GetUserIDfromTokenAsync(token));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }
    }
}
