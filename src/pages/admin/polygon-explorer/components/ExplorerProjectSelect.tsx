import { useT } from "@transifex/react";
import { FC, useEffect, useMemo, useRef, useState } from "react";

import { useProjectIndex } from "@/connections/Entity";
import { ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

type ExplorerProjectSelectProps = {
  projectUuid: string;
  projectLabel: string;
  onSelect: (uuid: string, label: string) => void;
};

const SEARCH_DEBOUNCE_MS = 300;
const PROJECT_PAGE_SIZE = 50;

const projectDisplayLabel = (project: ProjectLightDto): string => {
  const name = project.name?.trim() || "Untitled project";
  const org = project.organisationName?.trim();
  return org != null && org !== "" ? `${name} (${org})` : name;
};

/**
 * Searchable project picker backed by entity-service projects index (GET-only).
 * Same source the admin Projects list uses — supports searchFilter for autocomplete.
 * Selecting a project scopes the polygon load via research projectId[].
 */
const ExplorerProjectSelect: FC<ExplorerProjectSelectProps> = ({ projectUuid, projectLabel, onSelect }) => {
  const t = useT();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [query]);

  // Always fetch when the dropdown is open (empty query = first page of all projects).
  const [isLoaded, { data: projects, loadFailure }] = useProjectIndex({
    enabled: isOpen,
    pageSize: PROJECT_PAGE_SIZE,
    pageNumber: 1,
    sortField: "name",
    sortDirection: "ASC",
    filter: debouncedQuery !== "" ? { searchFilter: debouncedQuery } : {}
  });

  const options = useMemo(() => {
    return (projects ?? []).filter(project => project.uuid != null && project.uuid !== "");
  }, [projects]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current != null && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  const inputValue = isOpen ? query : projectLabel;
  const showLoading = isOpen && !isLoaded;
  const showError = isOpen && loadFailure != null;

  return (
    <div ref={containerRef} className="relative">
      <input
        type="search"
        value={inputValue}
        onChange={event => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setDebouncedQuery("");
          setIsOpen(true);
        }}
        placeholder={t("Search project by name…")}
        className="focus:border-blue-500 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none"
      />

      {projectUuid !== "" && !isOpen ? (
        <button
          type="button"
          className="text-blue-600 mt-1 text-xs font-medium hover:underline"
          onClick={() => onSelect("", "")}
        >
          {t("Clear project")}
        </button>
      ) : null}

      {isOpen ? (
        <div className="shadow-lg absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-neutral-200 bg-white">
          {showLoading ? (
            <p className="px-3 py-2 text-xs text-neutral-500">{t("Loading projects…")}</p>
          ) : showError ? (
            <p className="text-red-600 px-3 py-2 text-xs">{t("Failed to load projects")}</p>
          ) : options.length === 0 ? (
            <p className="px-3 py-2 text-xs text-neutral-500">
              {debouncedQuery !== ""
                ? t("No projects match “{query}”", { query: debouncedQuery })
                : t("No projects found")}
            </p>
          ) : (
            options.map(project => {
              const label = projectDisplayLabel(project);
              return (
                <button
                  key={project.uuid}
                  type="button"
                  className="block w-full border-b border-neutral-100 px-3 py-2 text-left text-sm text-neutral-800 last:border-b-0 hover:bg-neutral-50"
                  onClick={() => {
                    onSelect(project.uuid, label);
                    setQuery("");
                    setDebouncedQuery("");
                    setIsOpen(false);
                  }}
                >
                  <span className="block font-medium">{project.name?.trim() || t("Untitled project")}</span>
                  {project.organisationName != null && project.organisationName !== "" ? (
                    <span className="block text-xs text-neutral-500">{project.organisationName}</span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ExplorerProjectSelect;
