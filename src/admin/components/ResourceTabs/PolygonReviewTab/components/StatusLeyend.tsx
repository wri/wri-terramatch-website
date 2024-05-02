import Text from "@/components/elements/Text/Text";

const StatusLeyend = () => {
  return (
    <div className="flex flex-col px-2">
      <Text variant="text-16-bold" className="text-darkCustom">
        Status Legend
      </Text>
      <div>
        <Text variant="text-14-semibold" className="flex items-center gap-2 py-2 text-darkCustom">
          <div className="aspect-square h-3 w-3 rounded-sm bg-purple" /> Status Legend
        </Text>
        <Text variant="text-14-semibold" className="flex items-center gap-2 py-2 text-darkCustom">
          <div className="aspect-square h-3 w-3 rounded-sm bg-blue" /> Submitted
        </Text>
        <Text variant="text-14-semibold" className="flex items-center gap-2 py-2 text-darkCustom">
          <div className="aspect-square h-3 w-3 rounded-sm bg-green" /> Approved
        </Text>
        <Text variant="text-14-semibold" className="flex items-center gap-2 py-2 text-darkCustom">
          <div className="aspect-square h-3 w-3 rounded-sm bg-tertiary-600" /> Needs More Info
        </Text>
      </div>
    </div>
  );
};

export default StatusLeyend;
