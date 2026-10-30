import { useT } from "@transifex/react";
import { uniqBy } from "lodash";
import { FC, useCallback, useMemo } from "react";

import { SiteFilterOption } from "@/pages/site/[uuid]/components/polygonFilter.constants";
import Combobox from "@/redesignComponents/Forms/Inputs/Combobox";
import { isNotNull } from "@/utils/array";

import { useProjectSiteSearch } from "../hooks/useProjectSiteSearch";

type SiteFilterComboboxProps = {
  projectUuid: string;
  value: SiteFilterOption[];
  onChange: (sites: SiteFilterOption[]) => void;
};

const SiteFilterCombobox: FC<SiteFilterComboboxProps> = ({ projectUuid, value, onChange }) => {
  const t = useT();
  const { query, options, isLoading, onQueryChange } = useProjectSiteSearch(projectUuid);

  // The combobox labels its tags from the items it has seen, so the selected sites must be listed too.
  const items = useMemo(
    () => (query === "" ? uniqBy([...value, ...options], "value") : options),
    [options, query, value]
  );
  const selectedUuids = useMemo(() => value.map(site => site.value), [value]);

  const handleChange = useCallback(
    (uuids: string[]) => {
      const knownSites = [...value, ...options];
      onChange(uuids.map(uuid => knownSites.find(site => site.value === uuid)).filter(isNotNull));
    },
    [onChange, options, value]
  );

  return (
    <Combobox
      placeholder={t("Type to search sites")}
      size="small"
      noMarginBottom
      multiple
      showSelectedItems
      items={items}
      value={selectedUuids}
      isLoading={isLoading}
      onChange={handleChange}
      onQueryChange={onQueryChange}
    />
  );
};

export default SiteFilterCombobox;
