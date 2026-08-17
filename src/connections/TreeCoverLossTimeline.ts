import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  getTreeCoverLossTimeline,
  GetTreeCoverLossTimelineQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { TreeCoverLossTimelineDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useConnection } from "@/hooks/useConnection";

/**
 * The annual tree cover loss series — one row per site for a project, or one per polygon when a
 * site is given.
 *
 * This is the only indicator in the panel with a real time axis, and it is not stored as rows per
 * year: the series is a JSON map inside a single row, which the endpoint unpacks. year_of_analysis
 * is not the axis — 98% of polygons carry exactly one row of it.
 */
const treeCoverLossTimelineConnection = v3Resource("treeCoverLossTimelines", getTreeCoverLossTimeline)
  .index<TreeCoverLossTimelineDto>()
  // As with the rollup: raw query params, not Filter<>, because this endpoint is unpaginated.
  .filter<GetTreeCoverLossTimelineQueryParams>()
  .enabledProp()
  .buildConnection();

export const loadTreeCoverLossTimeline = connectionLoader(treeCoverLossTimelineConnection);

export const useTreeCoverLossTimeline = ({
  projectUuid,
  siteUuid,
  enabled = true
}: {
  projectUuid?: string;
  siteUuid?: string;
  enabled?: boolean;
}) => {
  const active = enabled && projectUuid != null && projectUuid !== "";
  return useConnection(treeCoverLossTimelineConnection, {
    enabled: active,
    filter: active ? { projectId: projectUuid, ...(siteUuid == null ? {} : { siteId: siteUuid }) } : undefined
  });
};
