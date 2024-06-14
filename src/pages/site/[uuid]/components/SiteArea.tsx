import { useT } from "@transifex/react";
import { Dispatch, SetStateAction, useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface SiteAreaProps {
  sites: any;
  editPolygon: boolean;
  setEditPolygon: Dispatch<SetStateAction<boolean>>;
}

const SiteArea = ({ sites, editPolygon, setEditPolygon }: SiteAreaProps) => {
  const t = useT();
  const [tabEditPolygon] = useState("Attributes");
  const [previewVersion, setPreviewVersion] = useState(false);
  return (
    <div className="flex h-[500px] rounded-lg  text-darkCustom">
      <div className="relative h-auto w-auto">
        <When condition={tabEditPolygon === "Version" && !!editPolygon}>
          <div className="absolute top-5 left-[43vw] z-20 text-center">
            <Button variant="primary" className="" onClick={() => {}}>
              {t("Confirm Version")}
              <Icon name={IconNames.IC_INFO_WHITE} className="ml-1 h-3 w-3 lg:h-4 lg:w-4" />
            </Button>
            <br />
            <Button
              variant="text"
              className="text-12-bold m-auto rounded-lg bg-[#a2a295b5] px-4 py-1 text-black underline underline-offset-2 hover:text-white"
              onClick={() => {}}
            >
              {t("Cancel")}
            </Button>
          </div>
        </When>
        <When condition={!!previewVersion}>
          <div className="absolute bottom-8 left-[54vw] z-20 w-[22vw] rounded bg-white p-3">
            <button className="absolute top-3 right-4 hover:opacity-60" onClick={() => setPreviewVersion(false)}>
              <Icon name={IconNames.CLEAR} className="h-3 w-3 wide:h-4 wide:w-4" />
            </button>
            <Text variant="text-10-bold" className="mb-4 text-center">
              {t("Preview Attributes")}
            </Text>
            <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
              <Text variant="text-10-light" className="opacity-60">
                {t("Polygon ID")}
              </Text>
              <Text variant="text-10-light">-</Text>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
              <Text variant="text-10-light" className="opacity-60">
                {t("Restoration Practice")}
              </Text>
              <Text variant="text-10-light">-</Text>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
              <Text variant="text-10-light" className="opacity-60">
                {t("Target Land Use System")}
              </Text>
              <Text variant="text-10-light">-</Text>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
              <Text variant="text-10-light" className="opacity-60">
                {t("Tree Distribution")}
              </Text>
              <Text variant="text-10-light">-</Text>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
              <Text variant="text-10-light" className="opacity-60">
                {t("Source")}
              </Text>
              <Text variant="text-10-light">-</Text>
            </div>
          </div>
        </When>
      </div>
      <OverviewMapArea entityModel={sites} type="sites" />
    </div>
  );
};

export default SiteArea;
