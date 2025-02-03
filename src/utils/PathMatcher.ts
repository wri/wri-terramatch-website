export class Redirect extends Error {
  constructor(readonly path?: string) {
    super(path);
  }
}

export class PathMatcher {
  constructor(private readonly path: string) {}

  redirect(url: string) {
    throw new Redirect(url);
  }

  /**
   * Make sure the user is on the given URL.
   * @param url URL to make sure the user is on.
   * @param startsWith if true, will allow the user to be on any page that starts with the given url.
   *   Otherwise, the user must be on exactly this path in order to avoid a redirect.
   */
  ensure(url: string, startsWith: boolean = true) {
    if (startsWith) this.startsWith(url)?.allow();
    else this.exact(url)?.allow();
    this.redirect(url);
  }

  /**
   * Abort processing, allowing the current route.
   */
  allow() {
    throw new Redirect();
  }

  /**
   * Chainable method to make next method call optional based on condition
   * @param condition the condition which determine `when` result
   */
  when(condition: boolean) {
    if (condition) {
      return this;
    } else {
      return undefined;
    }
  }

  if(condition: boolean, thenCallback?: Function, elseCallback?: Function) {
    if (condition) {
      thenCallback?.();
    } else {
      elseCallback?.();
    }
  }

  startsWith(url: string) {
    return this.when(this.path.startsWith(url));
  }

  includes(part: string) {
    return this.when(this.path.includes(part));
  }

  /**
   * To check if nextURL is equal to url
   * @param url string
   * @returns if condition satisfies return an instance of matcher otherwise undefined
   */
  exact(url: string) {
    return this.when(this.path === url);
  }
}
