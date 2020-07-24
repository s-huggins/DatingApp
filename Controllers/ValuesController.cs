using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetworkApp.API.Data;

namespace NetworkApp.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class ValuesController : ControllerBase
  {
    private readonly DataContext _context;

    public ValuesController(DataContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetValues()
    {
      var values = await _context.Values.ToListAsync();
      return Ok(values);
    }

    [Route("{id}")]
    [HttpGet]
    public async Task<IActionResult> GetValue(int id)
    {
      var value = await _context.Values.FirstOrDefaultAsync(v => v.Id == id);
      return Ok(value);
    }
  }
}
