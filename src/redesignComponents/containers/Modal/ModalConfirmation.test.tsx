import { fireEvent, render, screen } from "@testing-library/react";
import { ComponentProps, PropsWithChildren } from "react";

import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";

import Modal from "./Modal";
import ModalConfirmation from "./ModalConfirmation";
import ModalDelete from "./ModalDelete";
import ModalSubmit from "./ModalSubmit";

jest.mock("@transifex/react", () => ({ useT: () => (text: string) => text }));

jest.mock("@chakra-ui/react", () => ({
  Box: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Flex: ({ children }: PropsWithChildren) => <div>{children}</div>,
  List: {
    Root: ({ children }: PropsWithChildren) => <ul>{children}</ul>,
    Item: ({ children }: PropsWithChildren) => <li>{children}</li>
  },
  Text: ({ children }: PropsWithChildren) => <span>{children}</span>
}));

jest.mock("./Modal", () => ({
  __esModule: true,
  default: ({ open, header, content, footer, onClose }: ComponentProps<typeof Modal>) =>
    open ? (
      <div role="dialog">
        {header}
        <button onClick={() => onClose?.()}>Dismiss</button>
        {content}
        {footer}
      </div>
    ) : null
}));

jest.mock("@/redesignComponents/actions/Buttons/Button/Button", () => ({
  __esModule: true,
  default: ({ children, disabled, onClick, variant }: IButtonProps) => (
    <button disabled={disabled} onClick={onClick} data-variant={variant}>
      {children}
    </button>
  )
}));

describe("ModalConfirmation", () => {
  it("closes on cancel and dismiss without confirming", () => {
    const onOpenChange = jest.fn();
    const onConfirm = jest.fn();
    render(
      <ModalConfirmation
        open
        onOpenChange={onOpenChange}
        title="Delete polygon?"
        content="Cannot be undone."
        confirmButton={{ children: "Delete", onClick: onConfirm, variant: "negative" }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(onOpenChange.mock.calls).toEqual([[false], [false]]);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("leaves confirmation completion and closing to the caller", () => {
    const onOpenChange = jest.fn();
    const onConfirm = jest.fn();
    render(
      <ModalConfirmation
        open
        onOpenChange={onOpenChange}
        title="Delete polygon?"
        content="Cannot be undone."
        confirmButton={{ children: "Delete", onClick: onConfirm }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("preserves disabled actions during deletion", () => {
    const onOpenChange = jest.fn();
    const onConfirm = jest.fn();
    render(
      <ModalConfirmation
        open
        onOpenChange={onOpenChange}
        title="Delete polygon?"
        content="Cannot be undone."
        confirmButton={{ children: "Deleting...", disabled: true, loading: true, onClick: onConfirm }}
        cancelButton={{ disabled: true }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Deleting..." }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("keeps custom form content interactive", () => {
    render(
      <ModalConfirmation
        open
        onOpenChange={jest.fn()}
        title="Request information?"
        contentLayout="custom"
        content={
          <label>
            Comment
            <input />
          </label>
        }
        confirmButton={{ children: "Request Information" }}
      />
    );

    const input = screen.getByRole("textbox", { name: "Comment" });
    fireEvent.change(input, { target: { value: "Review the boundary" } });
    expect(screen.getByDisplayValue("Review the boundary")).toBe(input);
  });

  it("preserves the existing grouped actions and their callbacks", () => {
    const onCancel = jest.fn();
    const onDownload = jest.fn();
    const onSave = jest.fn();
    render(
      <ModalConfirmation
        open
        onOpenChange={jest.fn()}
        title="Save Changes?"
        content="Choose an action."
        buttonsCancel={[{ id: "cancel", children: "Cancel", onClick: onCancel }]}
        buttonsSecondary={[{ id: "download", children: "Download", onClick: onDownload }]}
        buttonsPrimary={[{ id: "save", children: "Save", onClick: onSave }]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Download" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onDownload).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});

const selectionProps = {
  open: true,
  items: [{ id: "north", label: "North plot" }],
  singular: { title: "One plot", description: "Single selection description" },
  plural: { title: "Multiple plots", description: "Multiple selection description" }
};

describe.each([
  { Component: ModalDelete, action: "Delete", variant: "negative" },
  { Component: ModalSubmit, action: "Yes, submit", variant: "primary" }
])("Selection confirmation: $action", ({ Component, action, variant }) => {
  it("uses the singular copy and subject for one item", () => {
    render(<Component {...selectionProps} onOpenChange={jest.fn()} onConfirm={jest.fn()} />);
    expect(screen.getByText("One plot")).toBeTruthy();
    expect(screen.getByText("Single selection description")).toBeTruthy();
    expect(screen.getByText("North plot?")).toBeTruthy();
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.queryByText("Multiple selection description")).toBeNull();
    expect(screen.getByRole("button", { name: action }).getAttribute("data-variant")).toBe(variant);
  });

  it("switches to plural copy and lists all selected items", () => {
    const { rerender } = render(<Component {...selectionProps} onOpenChange={jest.fn()} onConfirm={jest.fn()} />);
    rerender(
      <Component
        {...selectionProps}
        items={[...selectionProps.items, { id: "south", label: "South plot" }]}
        onOpenChange={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(screen.getByText("Multiple plots")).toBeTruthy();
    expect(screen.getByText("Multiple selection description")).toBeTruthy();
    expect(screen.getAllByRole("listitem").map(item => item.textContent)).toEqual(["North plot", "South plot"]);
    expect(screen.queryByText("Single selection description")).toBeNull();
  });

  it("calls the supplied action and leaves completion to the caller", () => {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();
    render(<Component {...selectionProps} onOpenChange={onOpenChange} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: action }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("prevents duplicate actions while loading", () => {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();
    render(
      <Component
        {...selectionProps}
        isLoading
        confirmLabel="Working"
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Working" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("disables confirmation for an empty selection", () => {
    const onConfirm = jest.fn();
    render(<Component {...selectionProps} items={[]} onOpenChange={jest.fn()} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: action }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByText("North plot?")).toBeNull();
  });
});

it("renders additional submit content without losing the selection", () => {
  render(
    <ModalSubmit {...selectionProps} onOpenChange={jest.fn()} onConfirm={jest.fn()}>
      <label>
        Comment
        <input />
      </label>
    </ModalSubmit>
  );
  fireEvent.change(screen.getByRole("textbox", { name: "Comment" }), { target: { value: "Please review" } });
  expect(screen.getByDisplayValue("Please review")).toBeTruthy();
  expect(screen.getByText("North plot?")).toBeTruthy();
  expect(screen.queryByText("You can’t undo this.")).toBeNull();
});

it("shows the irreversible action warning for deletion", () => {
  render(<ModalDelete {...selectionProps} onOpenChange={jest.fn()} onConfirm={jest.fn()} />);
  expect(screen.getByText("You can’t undo this.")).toBeTruthy();
});
