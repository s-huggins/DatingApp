using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using NetworkApp.API.Data;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace NetworkApp.API.Helpers
{
  public class LogUserActivity : IAsyncActionFilter
  {
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
      var resultContext = await next();

      var repo = resultContext.HttpContext.RequestServices.GetService<IDatingRepository>();

      var userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
      var user = await repo.GetUser(userId);
      user.LastActive = DateTime.Now;

      await repo.SaveAll();
    }
  }
}