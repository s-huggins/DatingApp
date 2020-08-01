using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetworkApp.API.Data;
using NetworkApp.API.Dtos;
using NetworkApp.API.Helpers;
using NetworkApp.API.Models;

namespace NetworkApp.API.Controllers
{
  [ApiController]
  [ServiceFilter(typeof(LogUserActivity))]
  [Authorize]
  [Route("api/[controller]")]
  public class UsersController : ControllerBase
  {
    private readonly IDatingRepository _repo;
    private readonly IMapper _mapper;
    public UsersController(IDatingRepository repo, IMapper mapper)
    {
      _mapper = mapper;
      _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
    {
      var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

      var userFromRepo = await _repo.GetUser(currentUserId);

      userParams.UserId = currentUserId;

      if (string.IsNullOrEmpty(userParams.Gender))
      {
        userParams.Gender = userFromRepo.Gender.ToLower() == "male" ? "female" : "male";
      }

      PagedList<User> users = await _repo.GetUsers(userParams);

      var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

      Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

      return Ok(usersToReturn);
    }

    [HttpGet("{id}", Name = "GetUser")]
    public async Task<IActionResult> GetUser(int id)
    {
      var user = await _repo.GetUser(id);

      var userToReturn = _mapper.Map<UserForDetailDto>(user);

      return Ok(userToReturn);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

      var userFromRepo = await _repo.GetUser(id);

      if (userFromRepo == null)
        return NotFound($"Could not find user with ID {id}");

      if (currentUserId != userFromRepo.Id)
        return Unauthorized();

      _mapper.Map(userForUpdateDto, userFromRepo);

      if (await _repo.SaveAll())
        return NoContent();

      throw new Exception($"Updating user {id} failed on save");
    }
  }
}