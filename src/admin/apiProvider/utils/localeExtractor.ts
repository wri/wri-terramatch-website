export const extractLocaleFromAdminPath = () => {
  let locale = null;
  const hasLocaleInPath = !location.pathname.startsWith("/admin");
  if (hasLocaleInPath) {
    locale = location.pathname.split("/")[1];
  }
  return locale;
};
