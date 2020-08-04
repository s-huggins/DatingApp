using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace NetworkApp.API.Helpers
{
  public class PagedList<T> : List<T>
  {
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }

    public PagedList(List<T> pageItems, int totalCount, int pageNumber, int pageSize)
    {
      TotalCount = totalCount;
      PageSize = pageSize;
      CurrentPage = pageNumber;
      TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
      this.AddRange(pageItems);
    }

    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
    {
      var count = await source.CountAsync();
      var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
      return new PagedList<T>(items, count, pageNumber, pageSize);
    }
    public static PagedList<T> Create(List<T> source, int pageNumber, int pageSize)
    {
      var count = source.Count;
      var items = source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
      return new PagedList<T>(items, count, pageNumber, pageSize);
    }
  }
}