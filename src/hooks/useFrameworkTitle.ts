import { useT } from "@transifex/react";

import { Framework, useFrameworkContext } from "@/context/framework.provider";

export const useFrameworkTitle = () => {
  const t = useT();
  const { framework } = useFrameworkContext();

  switch (framework) {
    case Framework.PPC:
      return t("Priceless Planet Coalition");

    case Framework.HBF:
      return t("Harit Bharat Fund");

    case Framework.TF:
    case Framework.TF_LANDSCAPES:
    case Framework.ENTERPRISES:
      return t("TerraFund");

    case Framework.UNDEFINED:
    default:
      return null;
  }
};
