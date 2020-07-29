using System.Linq;
using AutoMapper;
using NetworkApp.API.Dtos;
using NetworkApp.API.Models;

namespace NetworkApp.API.Helpers
{
  public class AutoMapperProfiles : Profile
  {
    public AutoMapperProfiles()
    {
      CreateMap<User, UserForListDto>()
        .ForMember(dest => dest.PhotoUrl, ops => ops.MapFrom((src, dest) =>
          {
            return src.Photos.FirstOrDefault(p => p.IsMain)?.Url;
          })
        )
        .ForMember(dest => dest.Age, ops => ops.MapFrom((src, dest) =>
          {
            return src.DateOfBirth.CalculateAge();
          })
        );

      CreateMap<User, UserForDetailDto>()
        .ForMember(dest => dest.PhotoUrl, ops => ops.MapFrom((src, dest) =>
          {
            return src.Photos.FirstOrDefault(p => p.IsMain)?.Url;
          })
        )
        .ForMember(dest => dest.Age, ops => ops.MapFrom((src, dest) =>
          {
            return src.DateOfBirth.CalculateAge();
          })
        );

      CreateMap<Photo, PhotoForDetailDto>();

      CreateMap<UserForUpdateDto, User>();
    }
  }
}