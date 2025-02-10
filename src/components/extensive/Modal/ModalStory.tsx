import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";
import { useModalContext } from "@/context/modal.provider";
import SectionShare from "@/pages/dashboard/impact-story/components/SectionShare";
import { CARD_IMPACT_STORY_MOCKED_DATA } from "@/pages/dashboard/mockedData/impactStory";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalBase, ModalProps } from "./Modal";
import { ModalId } from "./ModalConst";

export interface ModalStoryProps extends ModalProps {
  uuid: string;
  preview?: boolean;
}

const ModalStory = ({ uuid, className, preview, ...rest }: ModalStoryProps) => {
  const { closeModal } = useModalContext();
  const data = CARD_IMPACT_STORY_MOCKED_DATA.find(item => item.uuid === uuid);

  const handleClose = () => {
    closeModal(ModalId.MODAL_STORY);
  };

  return (
    <ModalBase
      {...rest}
      className={tw("relative max-h-[85vh] w-[85vw] max-w-[85vw] border-none px-0 pt-16 pb-0", className)}
    >
      <button className="absolute top-8 right-8 w-fit text-grey-500" onClick={handleClose}>
        <Icon name={IconNames.CLEAR} className="h-4 w-4 lg:h-5 lg:w-5" />
      </button>
      <div className="flex w-full flex-col gap-2 overflow-hidden px-28">
        <div className="flex gap-8 overflow-y-auto pr-10">
          <SectionShare uuid={uuid} className="min-w-max" />
          <div className="w-wekit h-max pb-15">
            <Text variant="text-40-bold" className="leading-[normal] text-darkCustom">
              {data?.title}
            </Text>
            <Text variant="text-14-light" className="mt-4 leading-[normal] text-darkCustom">
              <b>Date Added: </b>
              {data?.date}
            </Text>
            <Text variant="text-16" className="mt-6 leading-[normal] text-darkCustom" containHtml>
              {data?.description}
            </Text>
            <When condition={data?.image}>
              <div className="mt-8">
                <img src={data?.image} alt={data?.title} className="h-[45vh] w-full rounded-2xl lg:h-[50vh]" />
              </div>
            </When>
          </div>
        </div>
      </div>

      <When condition={preview}>
        <div className="w-full bg-purpleCustom-1000 py-3 text-center font-bold leading-[normal] text-white">
          Impact Story Preview
        </div>
      </When>
    </ModalBase>
  );
};

export default ModalStory;
