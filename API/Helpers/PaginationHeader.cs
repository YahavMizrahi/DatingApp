namespace API.Helpers
{
  public class PaginationHeader
  {
    public PaginationHeader(int currentPage, int itemsPerPage, int totalItems, int toatalPages)
    {
      CurrentPage = currentPage;
      ItemsPerPage = itemsPerPage;
      TotalItems = totalItems;
      ToatalPages = toatalPages;
    }

    public int CurrentPage { get; set; }
    public int ItemsPerPage { get; set; }
    public int TotalItems { get; set; }
    public int ToatalPages { get; set; }
  }
}