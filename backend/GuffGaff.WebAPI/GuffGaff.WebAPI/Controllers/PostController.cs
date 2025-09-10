using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuffGaff.WebAPI.Controllers
{
    public class PostController : Controller
    {
        private readonly IPostServices _postServices;

        public PostController(IPostServices postServices)
        {
            _postServices = postServices;
        }

        [HttpPost]
        [Route($"{apiHelper.PutPostAPI}")]
        private async Task<IActionResult> PutPostAsync([FromBody] Post post)
        {
            try
            {
                return Ok(await _postServices.SavePostAsync(post));
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
                return Ok(await _postServices.GetPostAsync(post));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.UpdateVoteAPI}")]
        private async Task<IActionResult> UpdateVoteAsync([FromBody] Vote vote)
        {
            try
            {
                return Ok(await _postServices.UpdateVoteAsync(vote));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }
    }
}
