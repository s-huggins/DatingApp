using System.ComponentModel.DataAnnotations;

namespace NetworkApp.API.Dtos
{
  public class UserForRegisterDto
  {
    [Required(ErrorMessage = "A username is required.")]
    public string Username { get; set; }

    [Required(ErrorMessage = "A password is required.")]
    [StringLength(16, MinimumLength = 8, ErrorMessage = "You must specify a password between 8 and 16 characters.")]
    public string Password { get; set; }
  }
}