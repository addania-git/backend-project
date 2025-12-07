using System.ComponentModel.DataAnnotations;

namespace DodgerGameApi.Models;

public class Score
{
    public int Id { get; set; }

    [Required, MaxLength(32)]
    public string Player { get; set; } = default!;

    [Range(0, 600)] // seconds
    public double Value { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}