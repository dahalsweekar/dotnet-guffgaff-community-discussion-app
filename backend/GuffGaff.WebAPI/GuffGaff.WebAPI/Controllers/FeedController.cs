using GuffGaff.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuffGaff.WebAPI.Controllers
{
    public class FeedController : Controller
    {
        private readonly IFeedServices _feedServices;

        public FeedController(IFeedServices feedServices)
        {
            _feedServices = feedServices;
        }

        [HttpPost]
        [Route($"{apiHelper.GetSavedPostsAPI}")]
        public async Task<IActionResult> GetSavedPostAsync()
        {
            try
            {
                return Ok(await _feedServices.GetSavedPostsAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }
    }
}
