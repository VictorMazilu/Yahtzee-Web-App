// AuthController.cs
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Web.Http;
using YahtzeeEndpoints.Models;

namespace YahtzeeEndpoints.Controllers
{
    [RoutePrefix("api/auth")]
    public class AuthController : ApiController
    {
        private const string SecretKey = "8pk8Sqz6JhV7SckihSCr3anebnj4uzfyQ9mpvZvnyF9ASD5mejkGft8ckJRm6nBvAggVw5WvXjxZycv2UxRkNmzNso3bpFBhjK6Y8pk8Sqz6JhV7SckihSCr3anebnj4uzfyQ9mpvZvnyF9ASD5mejkGft8ckJRm6nBvAggVw5WvXjxZycv2UxRkNmzNso3bpFBhjK6Y8pk8Sqz6JhV7SckihSCr3anebnj4uzfyQ9mpvZvnyF9ASD5mejkGft8ckJRm6nBvAggVw5WvXjxZycv2UxRkNmzNso3bpFBhjK6Y8pk8Sqz6JhV7SckihSCr3anebnj4uzfyQ9mpvZvnyF9ASD5mejkGft8ckJRm6nBvAggVw5WvXjxZycv2UxRkNmzNso3bpFBhjK6Y8pk8Sqz6JhV7SckihSCr3anebnj4uzfyQ9mpvZvnyF9ASD5mejkGft8ckJRm6nBvAggVw5WvXjxZycv2UxRkNmzNso3bpFBhjK6Y8pk8Sqz6JhV7SckihSCr3anebnj4uzfyQ9mpvZvnyF9ASD5mejkGft8ckJRm6nBvAggVw5WvXjxZycv2UxRkNmzNso3bpFBhjK6Y8pk8Sqz6JhV7SckihSCr3anebnj4uzfyQ9mpvZvnyF9ASD5mejkGft8ckJRm6nBvAggVw5WvXjxZycv2UxRkNmzNso3bpFBhjK6Y8pk8Sqz6JhV7SckihSCr3anebnj4uzfyQ9mpvZvnyF9ASD5mejkGft8ckJRm6nBvAggVw5WvXjxZycv2UxRkNmzNso3bpFBhjK6Y8pk8Sqz6JhV7SckihSCr3anebnj4uzfyQ9mpvZvnyF9ASD5mejkGft8ckJRm6nBvAggVw5WvXjxZycv2UxRkNmzNso3bpFBhjK6Y8pk8Sqz6JhV7SckihSCr3anebnj4uzfyQ9mpvZvnyF9ASD5mejkGft8ckJRm6nBvAggVw5WvXjxZycv2UxRkNmzNso3bpFBhjK6Y8pk8Sqz6JhV7SckihSCr3anebnj4uzfyQ9mpvZvnyF9ASD5mejkGft8ckJRm6nBvAggVw5WvXjxZycv2UxRkNmzNso3bpFBhjK6Y";
        private readonly SymmetricSecurityKey _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));

        [HttpPost]
        [Route("login")]
        public IHttpActionResult Login([FromBody] LoginModel model)
        {
            if (model.Username == "vicky" && model.Password == "yahtzee")
            {
                var token = GenerateToken(model.Username);
                UserData.UserImages.Add(token, null);
                return Ok(new { token });
            }

            return Unauthorized();
        }

        private string GenerateToken(string username)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), // Token expiration time
                SigningCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
