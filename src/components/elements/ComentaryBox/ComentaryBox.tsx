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
    <div className="flex flex-col gap-4">
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
          className="max-h-72 !min-h-0 resize-none border-none !p-0 text-xs"
          containerClassName="w-full"
          rows={1}
        />
        <label htmlFor="input-files" className="cursor-pointer">
          <input
            type="file"
            id="input-files"
            className="absolute z-[-1] h-[0.1px] w-[0.1px] overflow-hidden opacity-0"
          />
          <Icon name={IconNames.PAPER_CLIP} className="h-4 w-4" />
        </label>
      </div>
      <Button className="self-end" iconProps={{ name: IconNames.SEND, className: "h-4 w-4" }}>
        <Text variant="text-12-bold" className="text-white">
          SEND
        </Text>
      </Button>
    </div>
  );
};

export default ComentaryBox;
