import { NextRequest, NextResponse } from "next/server";
export const MiddlewareCacheKey = "middlewareCache";

type CallbackInterface = () => Response | null;

export class MiddlewareMatcher {
  private request: NextRequest;
  private result?: Response | null;

  constructor(request: NextRequest) {
    this.request = request;
  }

  /**
   * Redirect user with a given request
   * @param url relative path to redirect user
   * @returns redirect result
   */
  redirect(url: string | Function, options?: { cacheResponse: boolean }) {
    if (decodeURIComponent(this.request.nextUrl.pathname + this.request.nextUrl.search) !== url) {
      const _url = typeof url === "string" ? url : url(this.request);
      const output = NextResponse.redirect(new URL(_url, this.request.url));
      const setResultOutput = this.setResult(() => output);

      if (setResultOutput && options?.cacheResponse) {
        //Cache redirect result if result was set and flag passed.
        this.cache(_url);
      }

      return output;
    } else {
      return null;
    }
  }
  /**
   * Continue response without any change
   * @returns Next response
   */
  next() {
    this.setResult(() => NextResponse.next());
    return this;
  }

  /**
   * Chainable method to make next method call optional based on condition
   * @param condition the condition which determine `when` result
   * @returns MiddlewareMatcher | null
   */
  when(condition: boolean) {
    if (condition) {
      return this;
    } else {
      return undefined;
    }
  }

  /**
   *
   * @param condition the condition which determine which callback to get called
   * @param thenCallback callback if condition if true
   * @param elseCallback callback if condition if false
   * @returns void
   */
  async if(condition: boolean, thenCallback: Function, elseCallback: Function) {
    if (condition) {
      await thenCallback?.();
    } else {
      await elseCallback?.();
    }
  }

  /**
   * To check if nextURL start with given url
   * @param url string
   * @returns if condition satisfies return an instance of matcher otherwise undefined
   */
  startWith(url: string) {
    return this.when(this.request.nextUrl.pathname.startsWith(url));
  }

  /**
   * To check if nextURL is equal to url
   * @param url string
   * @returns if condition satisfies return an instance of matcher otherwise undefined
   */
  exact(url: string) {
    return this.when(this.request.nextUrl.pathname === url);
  }

  /**
   * check if nextURL is not equal to the given url
   * @param url string
   * @returns if condition satisfies return an instance of matcher otherwise undefined
   */
  notStartWith(url: string) {
    return this.when(this.request.nextUrl.pathname !== url);
  }

  /**
   * set matcher result if there is none
   * @param callback response handler
   */
  private setResult(callback: CallbackInterface) {
    if (!this.result) {
      this.result = callback();
      return true;
    }
    return false;
  }

  cache(url: string) {
    //@ts-ignore
    this.result?.cookies?.set(MiddlewareCacheKey, url, {
      expires: new Date(Date.now() + 5 * 5 * 60 * 1000)
    });

    return this;
  }

  /**
   * To get matcher result and return at the end of middleware function
   * @returns matcher result
   */
  getResult() {
    return this.result;
  }
}
