using System;
using System.ComponentModel.DataAnnotations;

namespace NetworkApp.API.Dtos
{
  public class UserForRegisterDto
  {
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [StringLength(16, MinimumLength = 8, ErrorMessage = "You must specify a password between 8 and 16 characters")]
    public string Password { get; set; }

    [Required(ErrorMessage = "Gender is required")]
    public string Gender { get; set; }

    [Required(ErrorMessage = "Name is required")]
    public string KnownAs { get; set; }

    [Required(ErrorMessage = "Date of birth is required")]
    public DateTime DateOfBirth { get; set; }

    [Required(ErrorMessage = "City is required")]
    public string City { get; set; }

    [Required(ErrorMessage = "Country is required")]
    public string Country { get; set; }

    public DateTime Created { get; set; }

    public DateTime LastActive { get; set; }

    public UserForRegisterDto()
    {
      Created = DateTime.Now;
      LastActive = DateTime.Now;
    }
  }
}