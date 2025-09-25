/**
 * to clone an array and update an element in it, use-case to update an state array
 * @param array original array
 * @param newItem item to be updated
 * @param uniqueKey key to find item in array with
 * @returns updated array
 */
export function updateArrayState<T>(array: T[], newItem: T, uniqueKey: string) {
  const _tmp = [...array];

  //@ts-ignore
  const index = _tmp.findIndex(v => v[uniqueKey] === newItem[uniqueKey]);
  _tmp[index] = newItem;

  return _tmp;
}

export function notEmpty(array?: any[] | null) {
  if (array && array.length > 0) {
    return true;
  }
  return false;
}

/**
 * Convert an object to array with one record or return it if it's already an array
 * return an empty array if input is undefined or null empty string
 * Note: This does not replace _.toArray()
 */
export function toArray<T>(element: T | T[]): NonNullable<T>[] {
  return (Array.isArray(element) ? element : element ? [element] : []) as NonNullable<T>[];
}

export function objectArrayHasDuplication(arr: any[], keys: string[]) {
  return (
    new Set(
      arr?.map(value => {
        return keys.map(key => value[key]).join("-");
      })
    ).size !== arr.length
  );
}

/**
 * A quick method to pass into an array to filter out null / undefined, and correctly type the result.
 *
 * ex:
 * const foo: (string | null)[] = ["one", null, "two", "three"];
 * foo.filter(isNotNull); // results in ["one", "two", "three"], and the type is `string[]` without any 'as' statement.
 */
export const isNotNull = <T>(value: T | null | undefined): value is T => value != null;
