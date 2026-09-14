import { useRouter } from "next/router";
import { FC, useCallback, useMemo } from "react";

import { useProjectIndex } from "@/connections/Entity";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";

/**
 * ProjectPickerSelect — the searchable project picker that lives on the right of every polygon-review
 * header (PolygonReviewHeader). Self-contained: it loads the project list, reads the current project
 * from the URL (`?project=`), and on select rewrites the URL (clearing any `?site=` drill-in). The
 * whole review is URL-driven, so switching projects here re-renders the workspace with no other wiring.
 */
const ProjectPickerSelect: FC = () => {
  const router = useRouter();
  const selectedProjectUuid = typeof router.query.project === "string" ? router.query.project : undefined;

  const [, { data: projects }] = useProjectIndex({ pageSize: 100 });

  const items = useMemo(
    () =>
      (projects ?? [])
        .map(item => ({
          label:
            item.organisationName != null
              ? `${item.name ?? item.uuid} — ${item.organisationName}`
              : item.name ?? item.uuid,
          value: item.uuid
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [projects]
  );

  const handleChange = useCallback(
    (value: string) => {
      const query = { ...router.query, project: value, site: undefined };
      void router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    },
    [router]
  );

  return (
    <HighLevelSelector
      autocomplete
      label="Project"
      placeholder="Search projects…"
      items={items}
      value={selectedProjectUuid}
      onChange={handleChange}
      width="20rem"
    />
  );
};

export default ProjectPickerSelect;
