using System.ComponentModel.DataAnnotations;

namespace DodgerGameApi.DTOs;

public class CreateScoreDto
{
    [Required, MaxLength(32)] public string Player { get; set; } = default!;
    [Range(0, 600)] public double Value { get; set; }
}

public class UpdateScoreDto : CreateScoreDto {}