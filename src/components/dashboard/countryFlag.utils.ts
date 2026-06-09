const FLAG_ICONS_4X3_CDN = "https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3";
const LOCAL_FLAG_PATH_PATTERN = /\/flags\/([^/]+)\.svg$/;

const iso2BySlugCache = new Map<string, string>();

export const buildRectangularFlagCdnUrl = (iso2: string): string => `${FLAG_ICONS_4X3_CDN}/${iso2.toLowerCase()}.svg`;

const extractFlagSlug = (src: string): string | null => {
  const match = src.match(LOCAL_FLAG_PATH_PATTERN);
  return match?.[1]?.toLowerCase() ?? null;
};

const extractIso2FromSvg = (svg: string): string | null =>
  svg.match(/id="flag-icons-([^"]+)"/)?.[1]?.toLowerCase() ?? null;

export const resolveRectangularFlagSrc = async (src: string): Promise<string> => {
  if (src === "" || !LOCAL_FLAG_PATH_PATTERN.test(src)) {
    return src;
  }

  const slug = extractFlagSlug(src);
  if (slug == null) {
    return src;
  }

  const cachedIso2 = iso2BySlugCache.get(slug);
  if (cachedIso2 != null) {
    return buildRectangularFlagCdnUrl(cachedIso2);
  }

  if (slug.length === 2) {
    iso2BySlugCache.set(slug, slug);
    return buildRectangularFlagCdnUrl(slug);
  }

  try {
    const response = await fetch(src);
    if (!response.ok) {
      return src;
    }

    const iso2 = extractIso2FromSvg(await response.text());
    if (iso2 == null) {
      return src;
    }

    iso2BySlugCache.set(slug, iso2);
    return buildRectangularFlagCdnUrl(iso2);
  } catch {
    return src;
  }
};
