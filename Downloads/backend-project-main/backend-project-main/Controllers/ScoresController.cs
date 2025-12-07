using DodgerGameApi.Data;
using DodgerGameApi.DTOs;
using DodgerGameApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DodgerGameApi.Controllers;

[ApiController]
[Route("api/scores")]
public class ScoresController : ControllerBase
{
    private readonly DodgerDbContext _db;
    public ScoresController(DodgerDbContext db) => _db = db;

    // Public: top 3 scores for the game UI
    [HttpGet("top")]
    public async Task<ActionResult<IEnumerable<double>>> GetTop()
    {
        var topValues = await _db.Scores
            .OrderByDescending(s => s.Value)
            .Take(3)
            .Select(s => s.Value)
            .ToListAsync();
        return Ok(topValues);
    }

    // Protected: list all scores (admin page)
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.Scores.OrderByDescending(s => s.CreatedAt).ToListAsync());

    // Read by id
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
        => (await _db.Scores.FindAsync(id)) is Score s ? Ok(s) : NotFound();

    // Create (public or protected based on your choice)
    [HttpPost]
    public async Task<IActionResult> Create(CreateScoreDto dto)
    {
        var s = new Score { Player = dto.Player, Value = Math.Round(dto.Value, 1) };
        _db.Scores.Add(s);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = s.Id }, s);
    }

    // Update (protected)
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateScoreDto dto)
    {
        var s = await _db.Scores.FindAsync(id);
        if (s is null) return NotFound();

        s.Player = dto.Player;
        s.Value = Math.Round(dto.Value, 1);
        await _db.SaveChangesAsync();
        return Ok(s);
    }

    // Delete (protected, Admin)
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var s = await _db.Scores.FindAsync(id);
        if (s is null) return NotFound();

        _db.Scores.Remove(s);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // Clear all (protected, Admin)
    [Authorize(Roles = "Admin")]
    [HttpDelete]
    public async Task<IActionResult> ClearAll()
    {
        _db.Scores.RemoveRange(_db.Scores);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Leaderboard cleared." });
    }
}