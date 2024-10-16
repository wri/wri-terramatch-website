import { FC } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Input from "@/components/elements/Inputs/Input/Input";
import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
}

const MonitoredTab: FC<IProps> = ({ label, ...rest }) => {
  return (
    <TabbedShowLayout.Tab label={label ?? "Monitored Data"} {...rest}>
      <div className="flex w-full gap-4">
        <div className="flex w-[30%] flex-col gap-4">
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
              contentRadioClassName="text-darkCustom-300 !border-neutral-300 py-[6px] px-[6px] rounded-lg w-fit"
              options={[
                { title: "All Polygons", value: "All Polygons" },
                { title: "Analysis Due <30 Days", value: "Analysis Due <30 Days" },
                { title: "Analysis Due < 7 Days", value: "Analysis Due < 7 Days" },
                { title: "OverDue", value: "OverDue" }
              ]}
            />
          </div>
          <Input
            name="email"
            type="text"
            label="Site"
            variant={"monitored"}
            required={false}
            placeholder=" "
            id="Site"
            labelClassName="capitalize text-14 mb-1.5"
            classNameContainerInput="!mt-0"
            containerClassName="flex flex-col"
            classNameError="!mt-0"
          />
          <Input
            name="email"
            type="text"
            label="Polygon Name"
            variant={"monitored"}
            required={false}
            placeholder=" "
            id="Polygon Name"
            labelClassName="capitalize text-14 mb-1.5"
            classNameContainerInput="!mt-0"
            containerClassName="flex flex-col"
            classNameError="!mt-0"
          />
          <div>
            <Text variant="text-14" className="mb-1.5 flex items-center gap-1">
              Plant Start Date
              <Icon name={IconNames.IC_INFO} className="ml-1 h-[14px] w-[14px] text-darkCustom" />
            </Text>
            <RadioGroup
              contentClassName="flex flex-wrap gap-1 !space-y-0"
              variantTextRadio="text-12-semibold"
              labelRadio="text-darkCustom-300"
              contentRadioClassName="text-darkCustom-300 !border-neutral-300 py-[6px] px-[6px] rounded-lg w-fit"
              options={[
                { title: "In last month", value: "In last month" },
                { title: "In last year", value: "In last year" },
                { title: "Specify Range", value: "Specify Range" }
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              name="email"
              type="text"
              label="Early Year"
              variant={"monitored"}
              required={false}
              placeholder=" "
              id="Early Year"
              labelClassName="capitalize text-14 mb-1.5"
              classNameContainerInput="!mt-0"
              containerClassName="flex flex-col"
              classNameError="!mt-0"
            />
            <Input
              name="email"
              type="text"
              label="Early Year"
              variant={"monitored"}
              required={false}
              placeholder=" "
              id="Early Year"
              labelClassName="capitalize text-14 mb-1.5"
              classNameContainerInput="!mt-0"
              containerClassName="flex flex-col"
              classNameError="!mt-0"
            />
          </div>
          <Button variant="secondary" className="border-neutral-300 px-8">
            Reset
          </Button>
        </div>
        <div>Analysis is due for 345 Polygons for this project. Please run analysis.</div>
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default MonitoredTab;
