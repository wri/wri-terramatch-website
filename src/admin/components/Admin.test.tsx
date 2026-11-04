import { render, screen } from "@testing-library/react";
import { Admin, CreateButton, DataProvider, Resource } from "react-admin";

const dataProvider = {
  getList: () => Promise.resolve({ data: [], total: 0 })
} as unknown as DataProvider;

const UserList = () => <CreateButton />;

describe("react-admin", () => {
  test("translates its built-in labels with the default i18n provider", async () => {
    render(
      <Admin dataProvider={dataProvider}>
        <Resource name="user" list={UserList} create={() => null} />
      </Admin>
    );

    await screen.findByLabelText("Create");
    expect(screen.queryByText("ra.action.create")).toBeNull();
    expect(screen.getAllByText("Users").length).toBeGreaterThan(0);
    expect(screen.queryByText("resources.user.name")).toBeNull();
  });
});
