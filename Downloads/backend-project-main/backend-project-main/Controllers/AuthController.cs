using System.Security.Cryptography;
using System.Text;
using DodgerGameApi.Data;
using DodgerGameApi.DTOs;
using DodgerGameApi.Models;
using DodgerGameApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DodgerGameApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly DodgerDbContext _db;
    private readonly ITokenService _tokens;

    public AuthController(DodgerDbContext db, ITokenService tokens)
    {
        _db = db; _tokens = tokens;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
            return Conflict(new { error = "Username already taken." });

        using var hmac = new HMACSHA256(); // For coursework; prefer PBKDF2/Argon2 for production
        var user = new User
        {
            Username = dto.Username,
            PasswordSalt = hmac.Key,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password)),
            Role = "Player"
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _tokens.CreateToken(user);
        return Created("api/auth/register", new { token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == dto.Username);
        if (user is null) return Unauthorized(new { error = "Invalid credentials." });

        using var hmac = new HMACSHA256(user.PasswordSalt);
        var compute = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
        if (!compute.SequenceEqual(user.PasswordHash)) return Unauthorized(new { error = "Invalid credentials." });

        var token = _tokens.CreateToken(user);
        return Ok(new { token });
    }
}