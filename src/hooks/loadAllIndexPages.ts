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

  for (let pageNumber = 2; pageNumber <= lastPage; pageNumber++) {
    const page = await loadPage(pageNumber);
    if (page.loadFailure != null) throw page.loadFailure;
    items.push(...(page.data ?? []));
  }

  return items;
};
