using GuffGaff.Database.DBContext;
using GuffGaff.Database.Models;
using GuffGaff.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;
using System.Text;
using WBpro.Services.Interfaces;

namespace GuffGaff.Services.Services
{
    public class Miscellaneous : IMiscellaneous
    {
        private GuffGaffDBContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly IJwtTokenHandler _jwtTokenHandler;
        public Miscellaneous(GuffGaffDBContext dBContext, IConfiguration configuration, IJwtTokenHandler jwtTokenHandler)
        {
            _dbContext = dBContext;
            _configuration = configuration;
            _jwtTokenHandler = jwtTokenHandler;
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

        public List<RankedPost> RankPosts(List<Post> posts)
        {
            try
            {
                var now = DateTime.UtcNow;

                var rankedPosts = posts.Select(post =>
                {
                    // Step 1: Skip or penalize removed posts
                    if (post.IsRemoved == true)
                    {
                        return new RankedPost
                        {
                            Post = post,
                            Score = -1 // Effectively excluded
                        };
                    }

                    // Step 2: Compute engagement score
                    double engagement = post.UpVotes - post.DownVotes + (post.Comments * 0.5);

                    // Step 3: Time decay for recency boost
                    double recencyBoost = 1.0;
                    if (post.PostedDate.HasValue)
                    {
                        var ageInHours = (now - post.PostedDate.Value).TotalHours;
                        recencyBoost = Math.Exp(-ageInHours / 12); // Decays over 12 hours
                    }

                    // Step 4: Final score
                    double score = engagement * recencyBoost;

                    return new RankedPost
                    {
                        Post = post,
                        Score = score
                    };
                });

                // Step 5: Order descending by score
                return rankedPosts
                    .Where(rp => rp.Score >= 0) // Exclude removed/invalid
                    .OrderByDescending(rp => rp.Score)
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseModelTask<List<Notification>>> CheckNotifications(User user)
        {
            try
            {
                var notification = await _dbContext.Notifications.Where(x => x.UserId == user.Email && x.IsReadByUser == false).ToListAsync();
                if (notification != null)
                {
                    return new ResponseModelTask<List<Notification>>(notification);
                }
                else
                {
                    return new ResponseModelTask<List<Notification>>(new List<Notification>());
                }
            }
            catch (Exception ex)
            {
                return new ResponseModelTask<List<Notification>>(new List<Notification>(), ex.Message);
            }
        }

        public async Task<ResponseModel> UpdateNotificationStatus(Notification notice)
        {
            try
            {
                var notification = await _dbContext.Notifications.Where(
                    x => x.ActionPostId == notice.ActionPostId
                    && x.ActionCommentId == notice.ActionCommentId
                    && x.ActionTaken == notice.ActionTaken
                    && x.UserId == notice.UserId
                    && x.InitiatorId == notice.InitiatorId
                    ).FirstOrDefaultAsync();
                if (notification != null)
                {
                    notification.IsReadByUser = true;

                    _dbContext.Notifications.Update(notification);
                    await _dbContext.SaveChangesAsync();

                }

                return new ResponseModel(true);
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }

        public async Task<ResponseModel> SendEmailAsync(Email request)
        {
            try
            {
                var UserDetails = await _dbContext.Users.Where(x => x.Email == request.ToEmail).FirstOrDefaultAsync();

                if (UserDetails != null)
                {
                    var res = await SendEmailforOTP(request, UserDetails);
                    if (res._isSuccess)
                    {
                        await _dbContext.Emails.AddAsync(request);
                        var dbResponse = await _dbContext.SaveChangesAsync();

                        res._message = "Email Sent.";
                    }
                    return res as ResponseModel;
                }
                else
                {
                    return new ResponseModel(true, "User does not exist.");
                }

            }
            catch (Exception ex)
            {
                return new ResponseModel(true, "Faliure: " + ex.Message);
            }

        }
        public async Task<ResponseModel> VerifyOTPAsync(Email otp)
        {
            try
            {
                bool otpExists = await _dbContext.Emails.AnyAsync(x => x.otp == otp.otp);
                bool emailExists = await _dbContext.Emails.AnyAsync(x => x.ToEmail == otp.ToEmail);
                return new ResponseModel(otpExists && emailExists);
            }
            catch (Exception ex)
            {
                return new ResponseModel(false);
            }

        }

        public async Task<ResponseModel> SendEmailforOTP(Email request, User UserDetails)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var fromEmail = emailSettings["SenderEmail"];
                var smtpClient = new SmtpClient(emailSettings["SmtpServer"])
                {
                    Port = int.Parse(emailSettings["SmtpPort"] ?? ""),
                    Credentials = new NetworkCredential(emailSettings["Username"], emailSettings["Password"]),
                    EnableSsl = true,
                };
                string mailComponent = createEmailBody(UserDetails, request);
                request.Subject = mailComponent.Split("&&")[0];
                request.Body = mailComponent.Split("&&")[1];
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(emailSettings["SenderEmail"]?.ToString() ?? "", emailSettings["SenderName"]),
                    Subject = request.Subject,
                    Body = request.Body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(request.ToEmail);

                var bodyBytes = Encoding.UTF8.GetBytes(request.Body);
                var bodyStream = new MemoryStream(bodyBytes);

                await smtpClient.SendMailAsync(mailMessage);
                return new ResponseModel(true);
            }

            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }

        public string createEmailBody(User cred, Email otp)
        {
            string Subject = "Reset Password";

            string Body = $@"
                <html>
                <body style='font-family: Arial, sans-serif; font-size: 14px; color: #333;'>
                    <p>Dear <strong>{cred.Name}</strong>,</p>

                    <p>
                        We have generated a <strong>One-Time Password (OTP)</strong> for you to verify your account:
                    </p>

                    <p style='font-size: 18px; font-weight: bold; color: #2c3e50;'>
                        {otp.otp}
                    </p>

                    <p>
                        If you did not request this, please ignore this email.
                    </p>

                    <br>

                    <p>
                        Best regards,<br>
                        <strong>author99</strong>
                    </p>
                </body>
                </html>
            ";

            return Subject + "&&" + Body;
        }

        public async Task<ResponseModel> SetNewPassword(User user)
        {
            try
            {
                var userDetails = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == user.Email);
                if (userDetails != null)
                {
                    Hasher hashPassword = new Hasher();
                    user.Password = hashPassword.hashPassword(user.Password);
                    userDetails.Password = user.Password;
                    await _dbContext.SaveChangesAsync();
                }

                return new ResponseModel(true, "Password changed");
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }

        public async Task<ResponseModelTask<Token>> GenerateTokenAsync(User user)
        {
            try
            {
                var token = _jwtTokenHandler.GenerateToken(user.Email, "any");
                Token newToken = new Token();
                newToken.Email = user.Email;
                newToken.TokenNo = token;
                await _dbContext.Tokens.AddAsync(newToken);
                await _dbContext.SaveChangesAsync();
                return new ResponseModelTask<Token>(newToken);

            }
            catch (Exception ex)
            {
                return new ResponseModelTask<Token>(new Token(), ex.Message);
            }
        }

        public async Task<ResponseModel> DeleteTokenAsync(User user)
        {
            try
            {
                var tokens = await _dbContext.Tokens
                            .Where(t => t.Email == user.Email)
                            .ToListAsync();
                if (tokens.Any())
                {
                    _dbContext.Tokens.RemoveRange(tokens);
                    await _dbContext.SaveChangesAsync();
                }

                return new ResponseModel(true);
            }
            catch (Exception ex)
            {
                return new ResponseModel(false, ex.Message);
            }
        }

        public async Task<ResponseModelTask<string>> GetUserIDfromTokenAsync(Token token)
        {
            try
            {
                var userid = await _dbContext.Tokens.Where(x => x.TokenNo == token.TokenNo).Select(e => e.Email).FirstOrDefaultAsync();
                return new ResponseModelTask<string>(userid ?? "");
            }
            catch (Exception ex)
            {
                return new ResponseModelTask<string>(string.Empty, ex.Message);
            }
        }
    }
}
