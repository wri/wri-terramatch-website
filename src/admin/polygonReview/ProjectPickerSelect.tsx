import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useState } from "react";

import { useFullProject, useProjectIndex } from "@/connections/Entity";
import { useDebounce } from "@/hooks/useDebounce";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";

type ProjectLike = { uuid: string; name?: string | null; organisationName?: string | null };

const labelFor = (project: ProjectLike): string =>
  project.organisationName != null
    ? `${project.name ?? project.uuid} — ${project.organisationName}`
    : project.name ?? project.uuid;

/**
 * ProjectPickerSelect — the searchable project picker that lives on the right of the polygon-review
 * header (PolygonReviewHeader). Self-contained: it reads the current project from the URL (`?project=`)
 * and on select rewrites the URL (dropping any `?site=` drill-in). The whole review is URL-driven, so
 * switching projects here re-renders the workspace with no other wiring.
 *
 * Search is server-side: the typed text is debounced and passed to `useProjectIndex` as a `search`
 * filter, so results aren't capped by what fits in the first page. The currently-selected project's
 * label is resolved via `useFullProject` and merged into the list, so it stays readable even when it
 * falls outside the filtered page.
 */
const ProjectPickerSelect: FC = () => {
  const t = useT();
  const router = useRouter();
  const selectedProjectUuid = typeof router.query.project === "string" ? router.query.project : undefined;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSetSearch = useDebounce(setSearchTerm, 300);

  const filter = useMemo(() => (searchTerm.trim() !== "" ? { search: searchTerm.trim() } : undefined), [searchTerm]);
  const [indexLoaded, { data: projects }] = useProjectIndex({ pageSize: 100, filter });

  // Keep the selected project's label resolvable even when it isn't in the current (possibly filtered)
  // page. `useFullProject` is a cache hit for a project already loaded by the page/workspace.
  const [, { data: selectedProject }] = useFullProject({ id: selectedProjectUuid });

  const items = useMemo(() => {
    const list = (projects ?? []).map(project => ({ label: labelFor(project), value: project.uuid }));
    // Merge in the selected project if the filtered page dropped it, so its label still renders.
    if (
      selectedProjectUuid != null &&
      selectedProject != null &&
      !list.some(item => item.value === selectedProjectUuid)
    ) {
      list.push({ label: labelFor(selectedProject), value: selectedProjectUuid });
    }
    return list.sort((a, b) => a.label.localeCompare(b.label));
  }, [projects, selectedProject, selectedProjectUuid]);

  const handleChange = useCallback(
    (value: string) => {
      // Drop `site` by deleting the key — assigning `undefined` would serialize to an empty `?site=`.
      const query = { ...router.query };
      delete query.site;
      query.project = value;
      void router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    },
    [router]
  );

  return (
    <HighLevelSelector
      autocomplete
      label={t("Project")}
      placeholder={t("Search projects…")}
      items={items}
      value={selectedProjectUuid}
      onChange={handleChange}
      onInputChange={debouncedSetSearch}
      emptyMessage={indexLoaded ? t("No projects found") : t("Loading projects…")}
      width="20rem"
    />
  );
};

export default ProjectPickerSelect;
