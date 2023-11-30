import React from "react";

import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";

import OrganizationAssignForm from "./components/OrganizationAssignForm";
import OrganizationAssignProvider from "./context/OrganizationCreate.provider";

//We need to rename these component! doesn't make sense!
const OrganizationAssignPage = () => {
  return (
    <BackgroundLayout>
      <ContentLayout>
        <OrganizationAssignProvider>
          <OrganizationAssignForm />
        </OrganizationAssignProvider>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default OrganizationAssignPage;
