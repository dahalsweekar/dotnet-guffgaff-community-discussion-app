using Microsoft.AspNetCore.Identity;

namespace GuffGaff.Services.Services
{
    public class Hasher
    {
        private readonly PasswordHasher<object> _passwordHasher = new();

        public string hashPassword(string password)
        {
            return _passwordHasher.HashPassword(null, password);
        }

        public bool verifyPassword(string hashPassword, string providedPassword)
        {
            var result = _passwordHasher.VerifyHashedPassword(null, hashPassword, providedPassword);
            return result == PasswordVerificationResult.Success;
        }
    }
}
