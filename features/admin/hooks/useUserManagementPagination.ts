export function usePagination(
  page: number,
  totalPages: number
) {
  const pages: (number | string)[] =
    [];

  // TOTAL PAGE
  if (totalPages <= 5) {
    for (
      let i = 1;
      i <= totalPages;
      i++
    ) {
      pages.push(i);
    }

    return pages;
  }

  // PAGE AWAL
  if (page <= 3) {
    pages.push(1, 2, 3);

    pages.push('...');

    pages.push(totalPages);

    return pages;
  }

  // PAGE TENGAH
  if (
    page > 3 &&
    page < totalPages - 2
  ) {
    pages.push(1);

    pages.push('...');

    pages.push(page - 1);
    pages.push(page);
    pages.push(page + 1);

    pages.push('...');

    pages.push(totalPages);

    return pages;
  }

  // PAGE AKHIR
  pages.push(1);

  pages.push('...');

  pages.push(totalPages - 2);
  pages.push(totalPages - 1);
  pages.push(totalPages);

  return pages;
}