import { FC } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import DataCard, { DataStructure } from "./components/DataCard";
import FormMonitored from "./components/FormMonitored";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
}

const MonitoredCardData: DataStructure[] = [
  {
    label: "Tree Cover (TTC)",
    tooltipContent: "Tooltip",
    tableData: [
      {
        polygonName: "ABA",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "Adison Thaochu A",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "ABA",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "Adison Thaochu A",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "ABA",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "Adison Thaochu A",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      }
    ]
  },
  {
    label: "Tree Cover Loss",
    tooltipContent: "Tooltip",
    tableData: [
      {
        polygonName: "ABA",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "Adison Thaochu A",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "ABA",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "Adison Thaochu A",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "ABA",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "Adison Thaochu A",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      }
    ]
  }
];

const MonitoredTab: FC<IProps> = ({ label, ...rest }) => {
  return (
    <TabbedShowLayout.Tab label={label ?? "Monitored Data"} {...rest}>
      <div className="flex w-full gap-4">
        <div className="flex w-[36%] flex-col gap-4">
          <div className="relative w-full self-center overflow-hidden rounded-lg">
            <img src="/images/map-img.png" alt="Monitored" className="w-full" />
            <div className="absolute top-0 z-10 flex h-full w-full items-center justify-center">
              <button className="text-12-semibold flex items-center rounded-full bg-white object-center px-2 py-1 text-primary hover:bg-primary hover:text-white lg:px-3">
                <Icon name={IconNames.MAP_PIN} className="mr-[3px] w-[10px] lg:w-3" />
                View Map
              </button>
            </div>
          </div>
          <div>
            <Text variant="text-14" className="mb-1.5 flex items-center gap-1">
              Display polygons
              <Icon name={IconNames.IC_INFO} className="ml-1 h-[14px] w-[14px] text-darkCustom" />
            </Text>
            <RadioGroup
              contentClassName="flex flex-wrap gap-1 !space-y-0"
              variantTextRadio="text-12-semibold"
              labelRadio="text-darkCustom-300"
              classNameRadio="!gap-1"
              contentRadioClassName="text-darkCustom-300 !border-neutral-300 py-[6px] px-[6px] rounded-lg w-fit"
              options={[
                { title: "All Polygons", value: "All Polygons" },
                { title: "Analysis Due <30 Days", value: "Analysis Due <30 Days" },
                { title: "Analysis Due < 7 Days", value: "Analysis Due < 7 Days" },
                { title: "OverDue", value: "OverDue" }
              ]}
            />
          </div>
          <FormMonitored />
        </div>
        <div className="flex w-full flex-col gap-5">
          {MonitoredCardData.map(data => (
            <DataCard key={data.label} data={data} />
          ))}
        </div>
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default MonitoredTab;
