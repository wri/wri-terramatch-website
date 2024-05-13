import Button from "../../Button/Button";
import Text from "../../Text/Text";
import PolygonCheck from "./PolygonCheck";

const CheckPolygonControl = () => {
  return (
    <div className="grid gap-2">
      <div className=" rounded-lg bg-[#ffffff26] p-3 text-center text-white backdrop-blur-md">
        <Text variant="text-10-light">Your polygons have been updated</Text>
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 hover:border-white"
        >
          Check Polygons
        </Button>
      </div>
      <PolygonCheck />
    </div>
  );
};

export default CheckPolygonControl;
