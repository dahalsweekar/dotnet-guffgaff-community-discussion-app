using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuffGaff.WebAPI.Controllers
{
    [ApiController]
    public class CommentController : Controller
    {

        private readonly ICommentServices _commentServices;

        public CommentController(ICommentServices commentServices)
        {
            _commentServices = commentServices;
        }

        [HttpPost]
        [Route($"{apiHelper.GetCommentAPI}")]
        public async Task<IActionResult> GetCommentsAsync([FromBody] Search post)
        {
            try
            {
                return Ok(await _commentServices.GetCommentsAsync(post));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.SaveCommentAPI}")]
        public async Task<IActionResult> SaveCommentAsync(Comment comment)
        {
            try
            {
                return Ok(await _commentServices.SaveCommentAsync(comment));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.SaveReplyAPI}")]
        public async Task<IActionResult> SaveReplyAsync(Reply reply)
        {
            try
            {
                return Ok(await _commentServices.SaveReplyAsync(reply));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.UpdateVoteCommentAPI}")]
        public async Task<IActionResult> UpVoteCommentAsync(Vote vote)
        {
            try
            {
                return Ok(await _commentServices.UpVoteCommentAsync(vote));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.UpdateCommentAPI}")]
        public async Task<IActionResult> UpdateCommentAsync([FromBody] Comment comment)
        {
            try
            {
                return Ok(await _commentServices.UpdateCommentAsync(comment));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.DeleteCommentAPI}")]
        public async Task<IActionResult> DeleteCommentAsync([FromBody] Comment comment)
        {
            try
            {
                return Ok(await _commentServices.DeleteCommentAsync(comment));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.UpdateReplyAPI}")]
        public async Task<IActionResult> UpdateReplyAsync([FromBody] Reply reply)
        {
            try
            {
                return Ok(await _commentServices.UpdateReplyAsync(reply));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }

        [HttpPost]
        [Route($"{apiHelper.DeleteReplyAPI}")]
        public async Task<IActionResult> DeleteReplyAsync([FromBody] Reply reply)
        {
            try
            {
                return Ok(await _commentServices.DeleteReplyAsync(reply));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + Environment.NewLine + ex.StackTrace);
            }
        }
    }
}
