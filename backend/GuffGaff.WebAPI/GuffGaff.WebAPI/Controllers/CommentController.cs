using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuffGaff.WebAPI.Controllers
{
    public class CommentController : Controller
    {

        private readonly ICommentServices _commentServices;

        public CommentController(ICommentServices commentServices)
        {
            _commentServices = commentServices;
        }

        [HttpPost]
        [Route($"{apiHelper.GetCommentAPI}")]
        public async Task<IActionResult> GetCommentsAsync(int postId)
        {
            try
            {
                return Ok(await _commentServices.GetCommentsAsync(postId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.GetCommentAPI}")]
        public async Task<IActionResult> SaveCommentAsync(Comment comment)
        {
            try
            {
                return Ok(await _commentServices.SaveCommentAsync(comment));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.GetCommentAPI}")]
        public async Task<IActionResult> SaveReplyAsync(Reply reply)
        {
            try
            {
                return Ok(await _commentServices.SaveReplyAsync(reply));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
