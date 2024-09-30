import { normalizeLocale, tx } from "@transifex/native";
import getConfig from "next/config";

const TRANSLATIONS_TTL_SEC = parseInt(process.env.TRANSIFEX_TRANSLATIONS_TTL_SEC || "600"); // This is in Second
const { publicRuntimeConfig } = getConfig();

/**
 * Used by SSR to pass translation to browser
 *
 * @param {*} { locale, locales }
 * @return {*} { locale, locales, translations }
 */
export async function getServerSideTranslations({ locale, locales }: any) {
  tx.init({
    token: publicRuntimeConfig.TxNativePublicToken
  });

  // ensure that nextjs locale is in the Transifex format,
  // for example, de-de -> de_DE
  const txLocale = normalizeLocale(locale);

  // load translations over-the-air
  await tx.fetchTranslations(txLocale);

  // bind a helper object in the Native instance for auto-refresh
  // @ts-ignore
  tx._autorefresh = tx._autorefresh || {};
  // @ts-ignore
  if (!tx._autorefresh[txLocale]) {
    // @ts-ignore
    tx._autorefresh[txLocale] = Date.now();
  }

  // check for stale content in the background
  // @ts-ignore
  if (Date.now() - tx._autorefresh[txLocale] > TRANSLATIONS_TTL_SEC * 1000) {
    // @ts-ignore
    tx._autorefresh[txLocale] = Date.now();
    tx.fetchTranslations(txLocale, { refresh: true });
  }

  return {
    locale,
    locales,
    translations: tx.cache.getTranslations(txLocale)
  };
}

/**
 * Initialize client side Transifex Native instance cache
 *
 * @param {*} { locale, translations }
 */
export function setClientSideTranslations({ locale, translations }: any) {
  if (!locale || !translations) return;
  tx.init({
    currentLocale: locale
  });
  tx.cache.update(locale, translations);
}
