type IndexPage<T> = {
  data?: T[] | null;
  indexTotal?: number | null;
  loadFailure?: unknown;
};

export const loadAllIndexPages = async <T>(
  loadPage: (pageNumber: number) => Promise<IndexPage<T>>,
  pageSize: number
): Promise<T[]> => {
  const firstPage = await loadPage(1);
  if (firstPage.loadFailure != null) throw firstPage.loadFailure;

  const items = [...(firstPage.data ?? [])];
  const total = firstPage.indexTotal ?? items.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const remainingPageNumbers = Array.from({ length: lastPage - 1 }, (_, index) => index + 2);

  const remainingPages = await Promise.all(remainingPageNumbers.map(pageNumber => loadPage(pageNumber)));
  for (const page of remainingPages) {
    if (page.loadFailure != null) throw page.loadFailure;
    items.push(...(page.data ?? []));
  }

  return items;
};
