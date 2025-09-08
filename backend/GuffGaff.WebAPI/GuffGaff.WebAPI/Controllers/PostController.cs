using GuffGaff.Database.Models;
using Microsoft.AspNetCore.Mvc;

namespace GuffGaff.WebAPI.Controllers
{
    public class PostController : Controller
    {
        [HttpPost]
        [Route($"{apiHelper.PostThoughtAPI}")]
        private async Task<IActionResult> PostThoughtAsync([FromBody] Thought thought)
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
