export const isSafari = (): boolean => {
  if (typeof window === "undefined") return false;

  const userAgent = navigator.userAgent;
  const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
  const isMac = /Mac|iPhone|iPad|iPod/.test(userAgent);

  return isSafariBrowser && isMac;
};
