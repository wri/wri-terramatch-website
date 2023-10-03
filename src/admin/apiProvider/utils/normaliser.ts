export function setOrderFromIndex<T extends any>(array: T[]): (T & { order: number })[] {
  return array.map((element: any, index) => ({ ...element, order: index }));
}
