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

      // BROKEN IN EF CORE 3
      // TODO: USE A STORED PROCEDURE AFTER MIGRATING AWAY FROM SQLITE
      // if (userParams.MinAge != 18 || userParams.MaxAge != 99)
      // {
      //   users = users.Where(u =>
      //     u.DateOfBirth.CalculateAge() >= userParams.MinAge
      //     && u.DateOfBirth.CalculateAge() <= userParams.MaxAge
      //   );
      // }

      // if non-default age specifiers
      // KEEP THIS AT THE END OF PIPELINE WHILE IT EXECUTES LOCALLY
      if (userParams.MinAge != 18 || userParams.MaxAge != 99)
      {
        ICollection<User> usersLocal = await users.ToListAsync();
        usersLocal = usersLocal.Where(u =>
          u.DateOfBirth.CalculateAge() >= userParams.MinAge
          && u.DateOfBirth.CalculateAge() <= userParams.MaxAge
        ).ToList();

        return PagedList<User>.Create(usersLocal, userParams.PageNumber, userParams.PageSize);
      }
      else
      {
        return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
      }
    }

    public Task<Photo> GetPhoto(int id)
    {
      var photo = _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

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
  }
}