import { useT } from "@transifex/react";
import { FC, useEffect, useState } from "react";

import Text from "@/components/elements/Text/Text";

export interface DashboardTableDataProps {
  label: string;
  valueText: string;
  value: number;
}

export interface GraphicLegendProps {
  label: string;
  value: string;
  color: string;
}
export interface DashboardDataProps {
  value?: number;
  unit?: string;
  secondValue?: string;
  graphic?: string;
  tableData?: DashboardTableDataProps[];
  maxValue?: number;
  totalSection?: { numberOfSites: number; totalHectaresRestored: number };
  graphicLegend?: GraphicLegendProps[];
  graphicTargetLandUseTypes?: DashboardTableDataProps[];
  objetiveText?: string;
  preferredLanguage?: string;
  landTenure?: string;
  totalValue?: number;
}

const ObjectiveSec: FC<{ data: DashboardDataProps }> = ({ data }) => {
  const t = useT();
  const [collapseText, setCollapseText] = useState(true);
  const [objectiveText, setObjectiveText] = useState(data.objetiveText);
  const maxLength = 660;

  useEffect(() => {
    if (collapseText) {
      setObjectiveText(data?.objetiveText?.slice(0, maxLength));
    } else {
      setObjectiveText(data?.objetiveText);
    }
  }, [collapseText, data?.objetiveText, objectiveText]);

  return (
    <div className="grid gap-6">
      {data?.objetiveText != null && (
        <div>
          <Text variant="text-14" className="text-darkCustom" containHtml={true}>
            {t(objectiveText)}
          </Text>
          {(data?.objetiveText?.length ?? 0) > maxLength && (
            <button onClick={() => setCollapseText(!collapseText)}>
              &nbsp;
              <Text variant="text-14-semibold" className="text-darkCustom">
                {collapseText ? t("...Read More") : t("Show Less")}
              </Text>
            </button>
          )}
        </div>
      )}
      {data?.preferredLanguage != null && (
        <div>
          <Text variant="text-14-semibold" className="text-darkCustom">
            {t(`Preferred Language: ${data.preferredLanguage}`)}
          </Text>
        </div>
      )}
      {data?.landTenure != null && (
        <div>
          <Text variant="text-14-light" className="text-darkCustom">
            {t("Land Tenure")}
          </Text>
          <Text variant="text-14-semibold" as={"span"} className="rounded bg-grey-950 px-2 py-1 text-darkCustom">
            {t(data.landTenure)}
          </Text>
        </div>
      )}
    </div>
  );
};

export default ObjectiveSec;
