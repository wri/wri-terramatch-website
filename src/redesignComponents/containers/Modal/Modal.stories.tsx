import { Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import Image from "next/image";
import React, { useState } from "react";

import { getThemedColor } from "../../../lib/theme";
import Button from "../../actions/Buttons/Button/Button";
import ModalStory from "./Modal";
import ModalSelectGalleryImages from "./ModalSelectGalleryImages";
import ModalUploadImage from "./ModalUploadImage";

const meta = {
  title: "Redesign Components/Containers/Modal",
  component: ModalStory,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof ModalStory>;

export default meta;
type Story = StoryObj<typeof meta>;

const ModalContent = ({ isLarge = false }: { isLarge?: boolean }) => {
  return (
    <div className="border-theme-neutral-700 bg-theme-neutral-200 flex flex-col gap-3 rounded-lg border border-dashed p-3">
      <div className="flex flex-col">
        <Text textStyle={isLarge ? "600-bold" : "400-bold"} color="neutral.800">
          Detach this instance
        </Text>
        <Text textStyle={isLarge ? "400" : "300"} color="neutral.700">
          To customise the contents of this component, detach the instance by right-clicking the component and selecting
          &nbsp;<strong>&quot;detach instance&quot;</strong>. Read the component design guidance to ensure correct
          usage.
        </Text>
      </div>
      <Image
        src="./images/modal-story.png"
        alt="Modal Example"
        width={100}
        height={100}
        className="border-theme-neutral-300 h-full w-full max-w-[292px] rounded-lg border object-cover"
      />
    </div>
  );
};

export const Modal: Story = {
  args: {
    header: (
      <Text textStyle="400-bold" color="neutral.800">
        Title
      </Text>
    ),
    content: <ModalContent />,
    open: false
  },
  render: args => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        <ModalStory {...args} open={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }
};

export const Small: Story = {
  args: {
    header: (
      <p
        style={{
          fontWeight: "bold",
          color: getThemedColor("neutral", 800)
        }}
      >
        Title
      </p>
    ),
    content: <ModalContent />,
    size: "small",
    open: false
  },
  render: args => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        <ModalStory {...args} open={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }
};

export const Medium: Story = {
  args: {
    header: (
      <p
        style={{
          fontWeight: "bold",
          color: getThemedColor("neutral", 800)
        }}
      >
        Title
      </p>
    ),
    content: <ModalContent />,
    size: "medium",
    open: false
  },
  render: args => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        <ModalStory {...args} open={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }
};

export const Large: Story = {
  args: {
    header: (
      <p
        style={{
          fontWeight: "bold",
          color: getThemedColor("neutral", 800)
        }}
      >
        Title
      </p>
    ),
    content: <ModalContent isLarge />,
    size: "large",
    open: false
  },
  render: args => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        <ModalStory {...args} open={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }
};

export const ExtraLarge: Story = {
  args: {
    header: (
      <p
        style={{
          fontWeight: "bold",
          color: getThemedColor("neutral", 800)
        }}
      >
        Title
      </p>
    ),
    content: <ModalContent isLarge />,
    size: "xlarge",
    open: false
  },
  render: args => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        <ModalStory {...args} open={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }
};

export const CustomSize: Story = {
  args: {
    header: (
      <p
        style={{
          fontWeight: "bold",
          color: getThemedColor("neutral", 800)
        }}
      >
        Title
      </p>
    ),
    content: <ModalContent />,
    open: false
  },
  render: args => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        <ModalStory {...args} open={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }
};

export const WithActions: Story = {
  args: {
    header: (
      <p
        style={{
          fontWeight: "bold",
          color: getThemedColor("neutral", 800)
        }}
      >
        Title
      </p>
    ),
    content: <ModalContent />,
    open: false
  },
  render: args => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        <ModalStory
          {...args}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Save
              </Button>
            </>
          }
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      </>
    );
  }
};

export const Draggable: Story = {
  args: {
    header: (
      <p
        style={{
          fontWeight: "bold",
          color: getThemedColor("neutral", 800)
        }}
      >
        Title
      </p>
    ),
    content: <ModalContent />,
    open: false
  },
  render: args => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        <ModalStory {...args} open={showModal} onClose={() => setShowModal(false)} draggable />
      </>
    );
  }
};

export const Blocking: Story = {
  args: {
    header: (
      <p
        style={{
          fontWeight: "bold",
          color: getThemedColor("neutral", 800)
        }}
      >
        Title
      </p>
    ),
    content: <ModalContent />,
    open: false
  },
  render: args => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        <ModalStory
          {...args}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Save
              </Button>
            </>
          }
          open={showModal}
          onClose={() => setShowModal(false)}
          blocking
        />
      </>
    );
  }
};

export const ModalUploadImageStory: Story = {
  args: {
    header: <div>ModalUploadImage</div>,
    content: <div>ModalUploadImage</div>,
    open: false
  },
  render: args => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        <ModalUploadImage
          {...args}
          open={showModal}
          onClose={() => setShowModal(false)}
          imgSrc="/images/about-us-2.png"
        />
      </>
    );
  }
};

export const ModalGalleryImagesStory: Story = {
  args: {
    header: <div>ModalGalleryImages</div>,
    content: <div>ModalGalleryImages</div>,
    open: false
  },
  render: args => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Show Modal</Button>
        <ModalSelectGalleryImages {...args} open={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }
};
