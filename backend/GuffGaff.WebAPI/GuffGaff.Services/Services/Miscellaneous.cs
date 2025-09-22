using GuffGaff.Database.DBContext;
using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GuffGaff.Services.Services
{
    public class Miscellaneous : IMiscellaneous
    {
        private GuffGaffDBContext _dbContext;
        public Miscellaneous(GuffGaffDBContext dBContext)
        {
            _dbContext = dBContext;
        }

        public async Task<List<ResponseModelTask<List<Post>>>> GetTrendingPosts()
        {
            List<ResponseModelTask<List<Post>>> responses = new List<ResponseModelTask<List<Post>>>();

            try
            {
                // time based
                var trendingPosts = await _dbContext.Posts
                    .Where(p => p.PostedDate != null)
                    .Select(p => new
                    {
                        Post = p,
                        HoursSincePosted = EF.Functions.DateDiffHour(p.PostedDate.Value, DateTime.UtcNow),
                        TrendingScore = ((p.UpVotes - p.DownVotes) + (p.Comments * 0.5)) /
                                        (EF.Functions.DateDiffHour(p.PostedDate.Value, DateTime.UtcNow) + 1)
                    })
                    .OrderByDescending(p => p.TrendingScore)
                    .Take(10)
                    .Select(p => p.Post)
                    .ToListAsync();

                // of all time
                var popularPosts = await _dbContext.Posts
                    .Select(p => new
                    {
                        Post = p,
                        TrendingScore = (p.UpVotes - p.DownVotes) + (p.Comments * 0.5)
                    })
                    .OrderByDescending(p => p.TrendingScore)
                    .Take(10)
                    .Select(p => p.Post)
                    .ToListAsync();

                responses.Add(new ResponseModelTask<List<Post>>(trendingPosts));
                responses.Add(new ResponseModelTask<List<Post>>(popularPosts));
                return responses;

            }
            catch (Exception ex)
            {
                responses.Add(new ResponseModelTask<List<Post>>(new List<Post>(), ex.Message));
                return responses;
            }
        }

        public async Task<ResponseModelTask<List<string>>> GetCategories()
        {
            try
            {
                List<string> categories = new List<string>();
                var result = await _dbContext.Posts.Select(x => x.Category).Distinct().ToListAsync();
                if (result.Count > 0)
                {
                    foreach (var cat in result)
                    {
                        categories.Add(cat);
                    }
                }
                return new ResponseModelTask<List<string>>(categories);
            }
            catch (Exception ex)
            {
                return new ResponseModelTask<List<string>>([], ex.Message);
            }
        }
    }
}
