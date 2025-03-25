import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface TooltipProjectProps {
  projectName: string;
  noSites?: number;
  country?: string;
  organizationName?: string;
  learnMore?: () => void;
}

const TooltipProject = (props: TooltipProjectProps) => {
  const { projectName, noSites = 0, country, organizationName, learnMore } = props;
  const t = useT();

  return (
    <div className="popup-project w-auto min-w-[17vw] max-w-[20vw] rounded bg-white p-2 lg:min-w-[17vw] lg:max-w-[15vw]">
      <div className="min-w-40 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Text className="pr-8 text-darkCustom" variant="text-12-bold">
            {t(projectName)}
          </Text>
          <div className="flex items-center gap-1">
            <Icon name={IconNames.PIN} className="h-3.5 w-3.5" />
            <Text className="leading-none text-darkCustom" variant="text-12-semibold">
              {t(noSites)} {noSites === 1 ? t("Site") : t("Sites")}
            </Text>
          </div>
        </div>
        <Text className="w-fit rounded-md bg-green-600 p-1 text-white" variant="text-12-bold">
          {t(country)}
        </Text>
        <Text className="text-darkCustom" variant="text-18-bold">
          {t(organizationName)}
        </Text>

        {learnMore && (
          <button onClick={() => learnMore()}>
            <Icon name={IconNames.ARROW} className="h-5 w-5 text-primary" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TooltipProject;
