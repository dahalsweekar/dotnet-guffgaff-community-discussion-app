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

    }
}
