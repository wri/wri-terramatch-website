import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import classNames from "classnames";

import { getThemedColor } from "@/lib/theme";

import RadioButtonGroup from "../Forms/Actions/RadioButton/Radio";

const meta: Meta = {
  title: "Redesign Components/Foundations/Colors",
  parameters: {
    layout: "padded"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj;

const colorShades = [900, 800, 700, 600, 500, 400, 300, 200, 100] as const;

type Shade = (typeof colorShades)[number];
type Variant = "primary" | "secondary";

const createTextOnColorGetter = (midToneColorToken: string) => (shade: Shade) => {
  if (shade === 900 || shade === 800 || shade === 700) {
    return "neutral.100";
  }

  return midToneColorToken;
};

const getTextOnPrimaryColor = createTextOnColorGetter("primary.900");
const getTextOnSecondaryColor = createTextOnColorGetter("secondary.900");

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Flex direction="column" gap={2}>
    <Text fontSize="400" fontWeight="bold" color="neutral.900">
      {title}
    </Text>
    {children}
  </Flex>
);

const BrandBar = ({ variant }: { variant: Variant }) => (
  <Box>
    <Box bg={`${variant}.500`} height="40px" width="100%" borderWidth="1px" borderColor="neutral.300" />
    <Text mt={2} fontSize="300" color="neutral.700">
      500
    </Text>
  </Box>
);

const ColorSwatch = ({
  variant,
  shade,
  emphasize,
  className
}: {
  variant: Variant;
  shade: Shade;
  emphasize?: boolean;
  className?: string;
}) => (
  <Box textAlign="center" flex="1" minW="56px">
    <Box bg={`${variant}.${shade}`} height="40px" className={className} />
    <Text mt={2} fontSize="300" color="neutral.800">
      {shade}
      {emphasize ? "*" : ""}
    </Text>
  </Box>
);

const TextOnBackgroundSwatch = ({
  variant,
  shade,
  getTextColor,
  className
}: {
  variant: Variant;
  shade: Shade;
  getTextColor: (shade: Shade) => string;
  className?: string;
}) => (
  <Box textAlign="center" flex="1" minW="56px">
    <Flex align="center" justify="center" bg={`${variant}.${shade}`} height="40px" className={className}>
      <Text fontSize="300" color={getTextColor(shade)}>
        Aa
      </Text>
    </Flex>
    <Text mt={2} fontSize="300" color="neutral.800">
      {shade}
      {shade === 500 ? "*" : ""}
    </Text>
  </Box>
);

const ColorScaleCard = ({ variant, getTextColor }: { variant: Variant; getTextColor: (shade: Shade) => string }) => (
  <Box bg="neutral.200" borderRadius="16px" p={8} boxShadow="sm">
    <VStack align="stretch" gap={5}>
      <Section title="Brand color">
        <BrandBar variant={variant} />
      </Section>

      <Section title="Variants">
        <Flex>
          {colorShades.map((shade, index) => (
            <ColorSwatch
              key={shade}
              variant={variant}
              shade={shade}
              emphasize={shade === 500}
              className={classNames("border-y border-theme-neutral-300", {
                "border-l": index === 0,
                "border-r": index === colorShades.length - 1
              })}
            />
          ))}
        </Flex>
      </Section>

      <Section title="Text-on-background">
        <Flex>
          {colorShades.map((shade, index) => (
            <TextOnBackgroundSwatch
              key={shade}
              variant={variant}
              shade={shade}
              getTextColor={getTextColor}
              className={classNames("border-theme-neutral-300", {
                "border-l": index === 0,
                "border-r": index === colorShades.length - 1
              })}
            />
          ))}
        </Flex>
      </Section>
    </VStack>
  </Box>
);

export const Primary: Story = {
  render: () => <ColorScaleCard variant="primary" getTextColor={getTextOnPrimaryColor} />
};

export const Secondary: Story = {
  render: () => <ColorScaleCard variant="secondary" getTextColor={getTextOnSecondaryColor} />
};

export const SecondaryNeutral: Story = {
  render: () => {
    return (
      <Box bg="neutral.200" borderRadius="16px" p={8} boxShadow="sm">
        <Box bg="secondary.neutral" height="40px" width="100%" borderWidth="1px" borderColor="neutral.300" />
      </Box>
    );
  }
};

const textOnBackgroundShades: Shade[] = [600, 500, 400];

const TextColorCard = ({ variant, getTextColor }: { variant: Variant; getTextColor: (shade: Shade) => string }) => (
  <Box bg="neutral.200" borderRadius="16px" p={8} boxShadow="sm">
    <VStack align="stretch" gap={5}>
      <Section title="Text color">
        <Box>
          <Box bg={`${variant}.900`} height="40px" width="100%" borderWidth="1px" borderColor="neutral.300" />
          <Text mt={2} fontSize="300" color="neutral.700">
            900
          </Text>
        </Box>
      </Section>

      <Section title="Text-on-background">
        <Flex>
          {textOnBackgroundShades.map((shade, index) => (
            <TextOnBackgroundSwatch
              key={shade}
              variant={variant}
              shade={shade}
              getTextColor={getTextColor}
              className={classNames("border-theme-neutral-300", {
                "border-l": index === 0,
                "border-r": index === textOnBackgroundShades.length - 1
              })}
            />
          ))}
        </Flex>
      </Section>
    </VStack>
  </Box>
);

export const PrimaryText: Story = {
  render: () => <TextColorCard variant="primary" getTextColor={getTextOnPrimaryColor} />
};

export const SecondaryText: Story = {
  render: () => <TextColorCard variant="secondary" getTextColor={getTextOnSecondaryColor} />
};

const controlOnNeutralLightBackgroundShades: Shade[] = [300, 200, 100];
const controlOnNeutralDarkBackgroundShades: Shade[] = [900, 800, 700];

const ControlOnBackgroundSwatch = ({
  backgroundShade,
  className,
  color
}: {
  backgroundShade: Shade;
  className?: string;
  color?: string;
}) => (
  <Box textAlign="center" flex="1" minW="56px">
    <Flex align="center" justify="center" bg={`neutral.${backgroundShade}`} height="40px" className={className}>
      <RadioButtonGroup
        name={`control-on-neutral-${backgroundShade}`}
        value="1"
        options={[{ value: "1", label: "" }]}
        horizontal
        color={color}
      />
    </Flex>
    <Text mt={2} fontSize="300" color="neutral.800">
      {backgroundShade}
    </Text>
  </Box>
);

const ControlColorCard = ({
  controlShade,
  backgroundShades,
  color
}: {
  controlShade: Shade;
  backgroundShades: Shade[];
  color?: string;
}) => (
  <Box bg="neutral.200" borderRadius="16px" p={8} boxShadow="sm">
    <VStack align="stretch" gap={5}>
      <Section title="Control color">
        <Box>
          <Box bg={`primary.${controlShade}`} height="40px" width="100%" borderWidth="1px" borderColor="neutral.300" />
          <Text mt={2} fontSize="300" color="neutral.700">
            {controlShade}
          </Text>
        </Box>
      </Section>

      <Section title="Control-on-background">
        <Flex>
          {backgroundShades.map((shade, index) => (
            <ControlOnBackgroundSwatch
              key={shade}
              backgroundShade={shade}
              color={color}
              className={classNames("border-theme-neutral-300", {
                "border-l": index === 0,
                "border-r": index === backgroundShades.length - 1
              })}
            />
          ))}
        </Flex>
      </Section>
    </VStack>
  </Box>
);

export const ControlsOnNeutralLights: Story = {
  render: () => <ControlColorCard controlShade={700} backgroundShades={controlOnNeutralLightBackgroundShades} />
};

export const ControlsOnNeutralDarks: Story = {
  render: () => (
    <ControlColorCard
      controlShade={200}
      backgroundShades={controlOnNeutralDarkBackgroundShades}
      color={getThemedColor("primary", 200)}
    />
  )
};
