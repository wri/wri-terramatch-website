import { useT } from "@transifex/react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

import { DashboardDataProps } from "../project-view/index.page";

const ObjectiveSec = ({ data }: { data: DashboardDataProps }) => {
  const t = useT();

  return (
    <div className="grid gap-6">
      <When condition={data?.objetiveText}>
        <div>
          <Text variant="text-14" className="text-darkCustom" containHtml={true}>
            {t(data.objetiveText)}
          </Text>
          <Text variant="text-14-semibold" className="text-darkCustom">
            {t("Read More...")}
          </Text>
        </div>
      </When>
      <When condition={data?.preferredLanguage}>
        <div>
          <Text variant="text-14-semibold" className="text-darkCustom">
            {t(`Preferred Language: ${data.preferredLanguage}`)}
          </Text>
        </div>
      </When>
      <When condition={data?.landTenure}>
        <div>
          <Text variant="text-14-light" className="text-darkCustom">
            {t("Land Tenure")}
          </Text>
          <Text variant="text-14-semibold" as={"span"} className="rounded bg-grey-950 px-2 py-1 text-darkCustom">
            {t(data.landTenure)}
          </Text>
        </div>
      </When>
    </div>
  );
};

export default ObjectiveSec;
