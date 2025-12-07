using System.ComponentModel.DataAnnotations;

namespace DodgerGameApi.Models;

public class User
{
    public int Id { get; set; }

    [Required, MinLength(3), MaxLength(32)]
    public string Username { get; set; } = default!;

    public byte[] PasswordHash { get; set; } = default!;
    public byte[] PasswordSalt { get; set; } = default!;

    public string Role { get; set; } = "Player";
}