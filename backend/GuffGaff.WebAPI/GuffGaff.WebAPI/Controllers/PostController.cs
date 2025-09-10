using GuffGaff.Database.Models;
using Microsoft.AspNetCore.Mvc;

namespace GuffGaff.WebAPI.Controllers
{
    public class PostController : Controller
    {
        [HttpPost]
        [Route($"{apiHelper.PutPostAPI}")]
        private async Task<IActionResult> PutPostAsync([FromBody] Post post)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.GetPostAPI}")]
        private async Task<IActionResult> GetPostAsync([FromBody] Post post)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }
    }
}
