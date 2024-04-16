import classNames from "classnames";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "../Menu/MenuVariant";
import Text from "../Text/Text";

const VersionInformation = () => {
  const itemsPrimaryMenu = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.SEARCH} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; Preview Version
        </Text>
      )
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.TRASH_PA} className="h-5 w-4 lg:h-6 lg:w-6 " />
          &nbsp; Delete Version
        </Text>
      )
    }
  ];
  const data = [
    {
      title: "ID Wenguru v4",
      date: "Feb 12, 24",
      current: "No"
    },
    {
      title: "ID Wenguru v3",
      date: "Feb 11, 24",
      current: "Yes"
    },
    {
      title: "ID Wenguru v2",
      date: "Feb 10, 24",
      current: "No"
    },
    {
      title: "ID Wenguru v1",
      date: "Feb 8, 24",
      current: "No"
    },
    {
      title: "ID Wenguru v1",
      date: "Feb 6, 24",
      current: "No"
    }
  ];
  return (
    <div className="grid">
      <div className="grid grid-flow-col grid-cols-4 border-b-2 border-t border-[#ffffff1a] py-2 opacity-60">
        <Text variant="text-10-light" className="col-span-2 text-white">
          Version
        </Text>
        <Text variant="text-10-light" className="text-white">
          Date
        </Text>
        <Text variant="text-10-light" className="text-white">
          Current
        </Text>
      </div>
      {data.map((item, index) => (
        <div key={index} className="grid grid-flow-col grid-cols-4 border-b border-[#ffffff1a] py-2 ">
          <Text variant="text-10" className="col-span-2 text-white">
            {item.title}
          </Text>
          <Text variant="text-10" className="text-white">
            {item.date}
          </Text>
          <div className="flex justify-between">
            <button
              className={classNames("text-10-bold w-[64%] rounded-md border border-white", {
                "bg-white text-[#797F62]": item.current === "Yes",
                "bg-transparent text-white": item.current === "No"
              })}
            >
              {item.current}
            </button>
            <Menu placement={MENU_PLACEMENT_RIGHT_BOTTOM} menu={itemsPrimaryMenu} className="">
              <Icon
                name={IconNames.IC_MORE_OUTLINED}
                className="h-4 w-4 rounded-lg text-white hover:fill-primary hover:text-primary lg:h-5 lg:w-5"
              />
            </Menu>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VersionInformation;
