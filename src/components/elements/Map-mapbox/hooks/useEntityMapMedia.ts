import { useEffect, useState } from "react";

import { MediaMapIndexEntity, useMediaMapIndex } from "@/connections/Media";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useValueChanged } from "@/hooks/useValueChanged";

import { MapMedia } from "../layers/mediaTypes";

type UseEntityMapMediaProps = {
  entity: MediaMapIndexEntity;
  uuid?: string;
  enabled?: boolean;
};

export const useEntityMapMedia = ({ entity, uuid, enabled = true }: UseEntityMapMediaProps) => {
  const { shouldRefetchMediaData, setShouldRefetchMediaData, setMediaFiles } = useMapAreaContext();
  const [, { data, refetch }] = useMediaMapIndex({ entity, uuid, enabled: enabled && uuid != null });

  const key = `${entity}|${uuid}`;
  const [loaded, setLoaded] = useState<{ key: string; media: MapMedia[] }>();
  useEffect(() => {
    if (data != null) setLoaded({ key, media: data.media });
  }, [data, key]);
  const media = loaded?.key === key ? loaded.media : undefined;

  useEffect(() => {
    setMediaFiles(media ?? []);
  }, [media, setMediaFiles]);

  useValueChanged(shouldRefetchMediaData, () => {
    if (shouldRefetchMediaData) {
      refetch();
      setShouldRefetchMediaData(false);
    }
  });

  return media;
};
