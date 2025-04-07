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
        <div className="flex flex-col gap-1.5 p-2">
          <Text variant="text-12-bold">{label}</Text>
          {items.map(item => (
            <div key={item.id}>
              <Text variant="text-12-light">{item.title}</Text>
              <Text variant="text-12-semibold">{item.value}</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopupMapImage;
