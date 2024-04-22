"use client";
import React, { useState } from "react";

import Button from "@/components/elements/Button/Button";
import ButtonUserRole from "@/components/elements/Button/ButtonUserRole";
import Text from "@/components/elements/Text/Text";
import UserRoleCard from "@/components/extensive/PageElements/Card/UserRoleCard";

import LoginLayout from "../layout";
import SignUpPage from "../signup/index.page";
import { UserRolInfo } from "./MockedData";

const Page = () => {
  const [selected, setSelected] = useState<string>();
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  return (
    <LoginLayout>
      {showSignUp ? (
        <SignUpPage role_id={selected as string} />
      ) : (
        <div className="mb-auto mt-auto w-[30vw]">
          <div className="mb-8 flex flex-col gap-2">
            <Text variant="text-32-bold" className="text-blue-700">
              Create an account
            </Text>
            <Text variant="text-12-light" className="text-blue-700">
              Create new account TerraMatch’s Pulse
            </Text>
          </div>
          <div className="mb-6 flex flex-col gap-2 lg:gap-3">
            {UserRolInfo.map(item => (
              <ButtonUserRole key={item.id} onClick={() => setSelected(item.id)} className="h-full w-full">
                <UserRoleCard
                  selected={selected == item.id}
                  title={item.title}
                  description={item.description}
                  options={item.options}
                  titleOptions={item.titleOption}
                />
              </ButtonUserRole>
            ))}
          </div>
          <Button
            className="text-14-bold flex w-full items-center justify-center rounded-lg border-2
                                    border-blue-300 bg-blue-300 py-6.5 text-white hover:border-white"
            onClick={() => setShowSignUp(true)}
          >
            Continue
          </Button>
        </div>
      )}
    </LoginLayout>
  );
};

export default Page;
