import Button from "@/components/elements/Button/Button";
import Input from "@/components/elements/Inputs/Input/Input";
import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const FormMonitored = () => {
  return (
    <>
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
          classNameRadio="!gap-1"
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
    </>
  );
};

export default FormMonitored;
