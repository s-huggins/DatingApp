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

      CreateMap<PhotoForCreationDto, Photo>();

      CreateMap<Photo, PhotoForReturnDto>();

      CreateMap<UserForRegisterDto, User>();

      CreateMap<MessageForCreationDto, Message>().ReverseMap();

      CreateMap<Message, MessageForReturnDto>()
        .ForMember(m => m.SenderPhotoUrl, ops => ops.MapFrom(
          m => m.Sender.Photos.FirstOrDefault(p => p.IsMain).Url
        ))
        .ForMember(m => m.RecipientPhotoUrl, ops => ops.MapFrom(
          m => m.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url
        ));

    }
  }
}