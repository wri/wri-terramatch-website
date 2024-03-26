import Button from "@/components/elements/Button/Button";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface IComentaryBox {
  name: string;
  lastName: string;
}

const ComentaryBox = (props: IComentaryBox) => {
  const { name, lastName } = props;

  return (
    <div className="flex items-center gap-2 rounded-3xl border border-grey-750 p-3">
      <div className="flex min-h-[32px] min-w-[32px] items-center justify-center self-start rounded-full bg-primary-500">
        <Text variant="text-14-semibold" className="uppercase text-white">
          {name[0]}
          {lastName[0]}
        </Text>
      </div>
      <TextArea
        placeholder="Add a comment"
        name=""
        className="max-h-72 min-h-0 resize-none border-none !p-0 text-xs"
        containerClassName="w-full"
        rows={1}
      />
      <Button variant="text" className="mb-[5px] self-end">
        <Icon name={IconNames.SEND} className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ComentaryBox;
