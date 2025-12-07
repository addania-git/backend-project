using DodgerGameApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DodgerGameApi.Data;

public class DodgerDbContext : DbContext
{
    public DodgerDbContext(DbContextOptions<DodgerDbContext> options) : base(options) {}

    public DbSet<User> Users => Set<User>();
    public DbSet<Score> Scores => Set<Score>();
    public DbSet<GameItem> GameItems => Set<GameItem>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        b.Entity<Score>()
            .HasIndex(s => new { s.Player, s.CreatedAt });

        base.OnModelCreating(b);
    }
}