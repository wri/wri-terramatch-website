"use client";
import React, { useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import ButtonUserRole from "@/components/elements/Button/ButtonUserRole";
import Text from "@/components/elements/Text/Text";
import UserRoleCard from "@/components/extensive/PageElements/Card/UserRoleCard";
import { useGetV2DashboardCountries } from "@/generated/apiComponents";

import LoginLayout from "../layout";
import SignUpPage from "../signup/index.page";
import { UserRolInfo } from "./MockedData";

const Page = () => {
  const [selected, setSelected] = useState<string>();
  const [selectedOption, setSelectedOption] = useState<string>();
  const [selectedTitleOption, setSelectedTitleOption] = useState<string>();
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const { data: dashboardCountries } = useGetV2DashboardCountries<any>({});
  const refContentCard = React.useRef<HTMLDivElement>(null);

  const updatedUserRolInfo = UserRolInfo.map((user, index) => {
    if (index === 1 && dashboardCountries?.data) {
      return { ...user, menu: dashboardCountries.data };
    } else {
      return user;
    }
  });

  const handleContinue = () => {
    const isOptionRequired = updatedUserRolInfo.find(item => item.id === selected)?.menu.length !== 0 || false;
    if (isOptionRequired && !selectedOption) {
      alert(`Please select an option for ${selectedTitleOption}.`);
      return;
    }
    setShowSignUp(true);
  };

  useEffect(() => {
    setSelectedOption("");
  }, [selected]);

  return (
    <LoginLayout>
      {showSignUp ? (
        <SignUpPage
          primary_role={selected as string}
          selectedOption={selectedOption as string}
          selectedTitleOption={selectedTitleOption as string}
        />
      ) : (
        <div className="mb-auto mt-auto w-[30vw]">
          <div className="mb-4 flex flex-col gap-2">
            <Text variant="text-32-bold" className="text-blueCustom-700">
              Create an account
            </Text>
            <Text variant="text-12-light" className="text-blueCustom-700">
              Create new account TerraMatch’s Pulse
            </Text>
          </div>
          <div
            className="mb-6 mr-[-10px] flex max-h-[calc(100vh-323px)] flex-col gap-2 overflow-y-auto pr-2.5 lg:gap-3"
            ref={refContentCard}
          >
            {updatedUserRolInfo.map(
              item => (
                console.log(item),
                (
                  <ButtonUserRole
                    key={item.id}
                    onClick={() => {
                      setSelected(item.id);
                      setSelectedTitleOption(item.titleOption);
                    }}
                    className="h-full w-full"
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
                    />
                  </ButtonUserRole>
                )
              )
            )}
          </div>
          <Button
            className="text-14-bold flex w-full items-center justify-center rounded-lg border-2 border-blue-300 bg-blue-300 py-3.5 text-white hover:border-white"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      )}
    </LoginLayout>
  );
};

export default Page;
