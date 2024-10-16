import { FC } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import Input from "@/components/elements/Inputs/Input/Input";

import DataCard, { DataStructure } from "./components/DataCard";

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
      }
    ]
  }
];

const MonitoredTab: FC<IProps> = ({ label, ...rest }) => {
  return (
    <TabbedShowLayout.Tab label={label ?? "Monitored Data"} {...rest}>
      <div className="flex w-full gap-4">
        <div className="w-[30%]">
          Map
          <Input
            name="email"
            type="text"
            label="Polygon Name"
            variant={"login"}
            required={false}
            placeholder=" "
            id="email"
            labelClassName="opacity-50 text-blueCustom-700 origin-left
              transition-transform duration-[0.3s,color] delay-[0.3s]
              absolute label-login text-14-light normal-case"
            classNameContainerInput="!mt-0"
            classNameError="!mt-0"
          />
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
