using System.ComponentModel.DataAnnotations;

namespace DodgerGameApi.DTOs;

public class RegisterDto
{
    [Required, MinLength(3), MaxLength(32)]
    public string Username { get; set; } = default!;

    [Required, MinLength(6), MaxLength(128)]
    public string Password { get; set; } = default!;
}

public class LoginDto
{
    [Required] public string Username { get; set; } = default!;
    [Required] public string Password { get; set; } = default!;
}