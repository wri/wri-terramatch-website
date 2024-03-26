import Text from "@/components/elements/Text/Text";

export interface IComentary {
  name: string;
  lastName: string;
  date: string;
  comentary: string;
}

const Comentary = (props: IComentary) => {
  const { name, lastName, date, comentary } = props;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="ml-3 flex h-fit min-h-[32px] min-w-[32px] items-center justify-center rounded-full bg-primary-500">
          <Text variant="text-14-semibold" className="uppercase text-white">
            {name[0]}
            {lastName[0]}
          </Text>
        </div>
        <div className="flex w-full flex-col gap-1">
          <Text variant="text-12-semibold" className="text-grey-250">
            {name} {lastName}
          </Text>
          <Text variant="text-10-light" className="text-grey-250 opacity-50">
            {date}
          </Text>
        </div>
      </div>
      <Text
        variant="text-12-light"
        className="max-h-72 overflow-auto rounded-2xl border border-grey-750 p-3 leading-[175%] text-grey-250 opacity-50"
      >
        {comentary}
      </Text>
    </div>
  );
};

export default Comentary;
