using System.ComponentModel.DataAnnotations;

namespace NetworkApp.API.Dtos
{
  public class UserForRegisterDto
  {
    [Required]
    public string Username { get; set; }

    [Required]
    [StringLength(16, MinimumLength = 8, ErrorMessage = "You must specify a password between 8 and 16 characters")]
    public string Password { get; set; }
  }
}