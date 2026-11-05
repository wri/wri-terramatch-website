import { uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";

import type { MapMedia } from "@/components/elements/Map-mapbox/layers/mediaTypes";
import { loadMediaMapIndex, MediaMapIndexEntity, pruneMediaMapIndexCache } from "@/connections/Media";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

type MediaScope = { entity: MediaMapIndexEntity; uuid: string };

type UseProjectMapMediaParams = {
  projectUuid: string | null;
  siteUuids: string[];
};

const NO_MEDIA: MapMedia[] = [];

const getScopesKey = (scopes: MediaScope[]) => scopes.map(({ entity, uuid }) => `${entity}|${uuid}`).join(",");

const loadScopesMedia = async (scopes: MediaScope[]) => {
  const results = await Promise.all(scopes.map(scope => loadMediaMapIndex({ ...scope, enabled: true })));
  return uniqBy(
    results.flatMap(({ data }) => data?.media ?? []),
    "uuid"
  );
};

export const useProjectMapMedia = ({ projectUuid, siteUuids }: UseProjectMapMediaParams) => {
  const { shouldRefetchMediaData, setShouldRefetchMediaData, setMediaFiles } = useMapAreaContext();

  const scopes = useMemo<MediaScope[]>(() => {
    if (projectUuid == null) return [];
    if (siteUuids.length > 0) return siteUuids.map(uuid => ({ entity: "sites", uuid }));
    return [{ entity: "projects", uuid: projectUuid }];
  }, [projectUuid, siteUuids]);
  const scopesKey = getScopesKey(scopes);

  const [reloadCount, setReloadCount] = useState(0);
  const [loaded, setLoaded] = useState<{ key: string; media: MapMedia[] }>();

  useEffect(() => {
    if (scopes.length === 0) return;

    let isCurrent = true;
    loadScopesMedia(scopes).then(
      media => {
        if (isCurrent) setLoaded({ key: getScopesKey(scopes), media });
      },
      error => Log.error("Failed to load geotagged photos for the polygon review map", error)
    );
    return () => {
      isCurrent = false;
    };
  }, [scopes, reloadCount]);

  const media = projectUuid == null ? NO_MEDIA : loaded?.key === scopesKey ? loaded.media : undefined;

  useEffect(() => {
    setMediaFiles(media ?? NO_MEDIA);
  }, [media, setMediaFiles]);

  useValueChanged(shouldRefetchMediaData, () => {
    if (!shouldRefetchMediaData) return;
    pruneMediaMapIndexCache(scopes);
    setReloadCount(count => count + 1);
    setShouldRefetchMediaData(false);
  });

  return media;
};
