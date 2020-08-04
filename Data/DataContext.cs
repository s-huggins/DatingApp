using Microsoft.EntityFrameworkCore;
using NetworkApp.API.Models;

namespace NetworkApp.API.Data
{
  public class DataContext : DbContext
  {
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<Value> Values { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Like> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      builder.Entity<Like>()
        .HasKey(l => new { l.LikerId, l.LikeeId });

      builder.Entity<Like>()
        .HasOne(l => l.Likee)
        .WithMany(l => l.Liker)
        .HasForeignKey(l => l.LikerId)
        .OnDelete(DeleteBehavior.Restrict);

      builder.Entity<Like>()
        .HasOne(l => l.Liker)
        .WithMany(l => l.Likee)
        .HasForeignKey(l => l.LikeeId)
        .OnDelete(DeleteBehavior.Restrict);
    }
  }
}