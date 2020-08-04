using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NetworkApp.API.Helpers;
using NetworkApp.API.Models;

namespace NetworkApp.API.Data
{
  public class DatingRepository : IDatingRepository
  {
    private readonly DataContext _context;

    public DatingRepository(DataContext context)
    {
      _context = context;
    }
    public void Add<T>(T entity) where T : class
    {
      _context.AddAsync(entity);

    }

    public void Delete<T>(T entity) where T : class
    {
      _context.Remove(entity);
    }

    public async Task<User> GetUser(int id)
    {
      var user = await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);

      return user;
    }

    public async Task<PagedList<User>> GetUsers(UserParams userParams)
    {
      IQueryable<User> users = _context.Users.Include(u => u.Photos).OrderByDescending(u => u.LastActive);

      users = users
        .Where(u => u.Id != userParams.UserId)
        .Where(u => u.Gender == userParams.Gender);

      // applying ordering early is fine since it is preserved by
      // later Where calls
      if (!string.IsNullOrEmpty(userParams.OrderBy))
      {
        switch (userParams.OrderBy.ToLower())
        {
          case "created":
            users = users.OrderByDescending(u => u.Created);
            break;
          default:
            users = users.OrderByDescending(u => u.LastActive);
            break;
        }
      }

      // further queries need to be client-side
      var usersLocal = users.ToList();

      if (userParams.Likers)
      {
        var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
        usersLocal = usersLocal.Where(u => userLikers.Any(liker => liker.LikerId == u.Id)).ToList();
      }

      if (userParams.Likees)
      {
        var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
        usersLocal = usersLocal.Where(u => userLikees.Any(likee => likee.LikeeId == u.Id)).ToList();
      }

      if (userParams.MinAge != 18 || userParams.MaxAge != 99)
      {
        usersLocal = usersLocal.Where(u =>
          u.DateOfBirth.CalculateAge() >= userParams.MinAge
          && u.DateOfBirth.CalculateAge() <= userParams.MaxAge
        ).ToList();

      }

      return PagedList<User>.Create(usersLocal, userParams.PageNumber, userParams.PageSize);
    }

    private async Task<IEnumerable<Like>> GetUserLikes(int id, bool likers)
    {
      var user = await _context.Users
        .Include(u => u.Likee)
        .Include(u => u.Liker)
        .FirstOrDefaultAsync(u => u.Id == id);

      if (likers)
      {
        return user.Likee.Where(l => l.LikeeId == id);
      }
      else
      {
        return user.Liker.Where(l => l.LikerId == id);
      }
    }

    public async Task<Photo> GetPhoto(int id)
    {
      var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

      return photo;
    }

    public async Task<bool> SaveAll()
    {
      return !_context.ChangeTracker.HasChanges() || (await _context.SaveChangesAsync()) > 0;
    }

    public async Task<Photo> GetMainPhotoForUser(int userId)
    {
      return await _context.Photos.Where(p => p.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
    }

    public async Task<Like> GetLike(int userId, int recipientId)
    {
      return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
    }
  }
}