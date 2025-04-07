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
};

const PopupMapImage = ({ label, imageUrl, items = [] }: PopupMapImageProps) => {
  return (
    <div className="popup-project-image-map w-auto min-w-[17vw] max-w-[20vw] rounded-lg bg-white lg:min-w-[17vw] lg:max-w-[15vw]">
      <div className="flex flex-col">
        <img
          src={imageUrl || "/images/no-image-available.png"}
          alt="Map preview of the project location"
          className="h-30 w-full rounded-t-lg object-cover"
        />
        <div className="flex flex-col gap-2 p-2">
          <Text variant="text-12-bold" className="leading-[normal]">
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
        </div>
      </div>
    </div>
  );
};

export default PopupMapImage;
