import Text from "../../Text/Text";

export type Item = {
  id: string;
  title: string;
  value: string;
};

type PopupMapImageProps = {
  label: string;
  imageUrl?: string;
  items?: Item[];
  learnMore?: () => void;
};

const PopupMapImage = ({ label, imageUrl, items = [], learnMore }: PopupMapImageProps) => {
  return (
    <div className="popup-project-image-map w-auto min-w-[17vw] max-w-[20vw] cursor-pointer rounded-lg bg-white lg:min-w-[17vw] lg:max-w-[15vw]">
      <div className="flex flex-col">
        <img
          src={imageUrl || "/images/no-image-available.png"}
          alt="Map preview of the project location"
          className="h-30 w-full rounded-t-lg object-cover"
        />
        <div className="flex flex-col gap-2 p-2">
          <Text variant="text-12-bold" className="overflow-hidden leading-[normal] line-clamp-2">
            {label}
          </Text>
          {items.map(item => (
            <div key={item.id} className="flex flex-col gap-0.5">
              <Text variant="text-12-light" className="leading-[normal]">
                {item.title}
              </Text>
              <Text variant="text-12-semibold" className="leading-[normal]">
                {item.value}
              </Text>
            </div>
          ))}
          <button onClick={learnMore} className="text-blue-600 mt-1 self-start text-xs hover:underline">
            Visit Project Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupMapImage;
