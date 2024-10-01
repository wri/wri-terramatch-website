"use client";
import { useT } from "@transifex/react";
import React, { useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import UserRoleCard from "@/components/elements/Cards/UserRoleCard/UserRoleCard";
import Text from "@/components/elements/Text/Text";
import { useGetV2DashboardCountries } from "@/generated/apiComponents";

import LoginLayout from "../layout";
import SignUpPage from "../signup/index.page";
import { UserRoleInfo } from "./MockedData";

const Page = () => {
  const t = useT();
  const [selected, setSelected] = useState<string>();
  const [selectedOption, setSelectedOption] = useState<string>();
  const [selectedTitleOption, setSelectedTitleOption] = useState<string>();
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const { data: dashboardCountries } = useGetV2DashboardCountries<any>({
    queryParams: {}
  });
  const refContentCard = React.useRef<HTMLDivElement>(null);

  const updatedUserRoleInfo = UserRoleInfo.map((user, index) => {
    if (index === 1 && dashboardCountries?.data) {
      return { ...user, menu: dashboardCountries.data };
    } else {
      return user;
    }
  });

  const handleContinue = () => {
    if (selected) {
      const isOptionRequired = updatedUserRoleInfo.find(item => item.id === selected)?.menu.length !== 0 || false;
      if (isOptionRequired && !selectedOption) {
        alert(`Select a ${selectedTitleOption == "Select Framework" ? "Framework" : "Country"} to continue`);
        return;
      }
      setShowSignUp(true);
    } else {
      alert("Please select an User.");
    }
  };

  useEffect(() => {
    setSelectedOption("");
  }, [selected]);

  return (
    <LoginLayout>
      {showSignUp ? (
        <SignUpPage
          role={selected as string}
          selectedOption={selectedOption as string}
          selectedTitleOption={selectedTitleOption as string}
        />
      ) : (
        <div className="mb-auto mt-auto w-[30vw]">
          <div className="mb-4 flex flex-col gap-2">
            <Text variant="text-32-bold" className="text-blueCustom-700">
              {t("Create an account")}
            </Text>
            <Text variant="text-12-light" className="text-blueCustom-700">
              {t("Create new account TerraMatch’s Pulse")}
            </Text>
          </div>
          <div
            className="mb-6 mr-[-10px] flex max-h-[calc(100vh-323px)] flex-col gap-2 overflow-y-auto pr-2.5 lg:gap-3"
            ref={refContentCard}
          >
            {updatedUserRoleInfo.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setSelected(item.id);
                  setSelectedTitleOption(item.titleOption);
                }}
                className="mouse-pointer h-full w-full"
              >
                <UserRoleCard
                  selected={selected == item.id && selectedTitleOption == item.titleOption}
                  title={item.title}
                  description={item.description}
                  options={item?.menu}
                  titleOptions={item.titleOption}
                  setSelectedOption={setSelectedOption}
                  selectedOption={selectedOption}
                  refContentCard={refContentCard}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>
          <Button
            className="text-14-bold flex w-full items-center justify-center rounded-lg border-2 border-primary bg-primary py-3.5 text-white hover:border-white"
            onClick={handleContinue}
          >
            {t("Continue")}
          </Button>
        </div>
      )}
    </LoginLayout>
  );
};

export default Page;
