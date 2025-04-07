import Text from "../../Text/Text";

const PopupMapImage = () => {
  return (
    <div className="w-auto min-w-[17vw] max-w-[20vw] rounded-lg bg-white lg:min-w-[17vw] lg:max-w-[15vw]">
      <div className="flex flex-col">
        <img
          src="/images/no-image-available.png"
          alt="Map preview of the project location"
          className="h-30 w-full rounded-t-lg object-cover"
        />
        <div className="flex flex-col gap-1.5 p-2">
          <Text variant="text-12-bold">YAOO YAWOVI</Text>
          <div>
            <Text variant="text-12-light">Organization</Text>
            <Text variant="text-12-semibold" className="leading-[normal]">
              Promoting Biodiversity Conservation and Sustainable Livehoods in Obudu Plateu - ARADIN
            </Text>
          </div>
          <div>
            <Text variant="text-12-light">Hectares Under Restoration</Text>
            <Text variant="text-12-semibold">1,500 ha</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupMapImage;
