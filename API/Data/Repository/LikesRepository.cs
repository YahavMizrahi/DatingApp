using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository
{
  public class LikesRepository : ILikesRepository
  {
    private readonly DataContext _context;
    public LikesRepository(DataContext context)
    {
      _context = context;

    }
    public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
    {
      return await _context.Likes.FindAsync(sourceUserId, likedUserId);
    }

    public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
    {
      var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
      var Likes = _context.Likes.AsQueryable();

      if (likesParams.Predicate == "liked")
      {
        Likes = Likes.Where(like => like.SourceUserId == likesParams.UserId);
        users = Likes.Select(like => like.LikedUser);
      }

      if (likesParams.Predicate == "likedBy")
      {
        Likes = Likes.Where(like => like.LikedUserId == likesParams.UserId);
        users = Likes.Select(like => like.SourceUser);
      }
      var likedUsers = users.Select(user => new LikeDto
      {
        Username = user.UserName,
        KnownAs = user.KnownAs,
        Age = user.DateOfBirth.CalculateAge(),
        PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
        City = user.City,
        Id = user.Id,
        Country = user.Country
      });

      return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
    }

    public async Task<AppUser> GetUserWithLikes(int userId)
    {
      return await _context.Users.Include(x => x.LikedUsers)
      .FirstOrDefaultAsync(x => x.Id == userId);

    }
  }
}