import React from "react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

interface ProfileCellProps {
  value: string;
  profileImage?: string | React.ReactNode;
}

export const ProfileCell = ({ value, profileImage }: ProfileCellProps) => {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-theme-primary-800 bg-theme-neutral-100 p-0.5">
        {profileImage ? (
          typeof profileImage === "string" ? (
            <img src={profileImage} alt={value} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
          ) : (
            profileImage
          )
        ) : (
          <PlaceholderIcon className="h-4 w-4 text-theme-neutral-600" />
        )}
      </div>
      <span className="text-theme-primary-900">{value}</span>
    </div>
  );
};
