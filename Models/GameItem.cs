using System.ComponentModel.DataAnnotations;

namespace DodgerGameApi.Models;

public class GameItem
{
    public int Id { get; set; }

    [Required, MaxLength(64)]
    public string Name { get; set; } = default!;

    [Required, MaxLength(32)]
    public string Type { get; set; } = default!; // Weapon, Armor, Potion

    [Range(0, 999)]
    public int PowerLevel { get; set; }

    [Range(0, 999999)]
    public int Price { get; set; }
}