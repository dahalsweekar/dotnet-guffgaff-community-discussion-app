namespace WBpro.Services.Interfaces
{
    public interface IJwtTokenHandler
    {
        public string GenerateToken(string userId, string role);
    }
}
