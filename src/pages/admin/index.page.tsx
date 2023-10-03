import type { NextPage } from "next";
import dynamic from "next/dynamic";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

// Dynamic import to improve performance
// https://nextjs.org/docs/advanced-features/dynamic-import
const App = dynamic(() => import("../../admin/components/App"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center gap-2">
      <h1 className="text-2xl">Loading</h1>
      <Icon name={IconNames.SPINNER} width={40} height={40} className="!m-0 animate-spin" />
    </div>
  )
});

const AdminPanel: NextPage = () => <App />;

export default AdminPanel;
