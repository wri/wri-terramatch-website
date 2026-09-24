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

type SemanticVariant = "negative" | "attention" | "positive" | "neutralActive" | "neutralPassive";

type SemanticHue = {
  label: string;
  shade: 100 | 200 | 300;
  accessibleOnlyWithBorder?: boolean;
};

type SemanticCategory = {
  title: string;
  description: string;
  variant: SemanticVariant;
  hues: SemanticHue[];
};

const semanticCategories: SemanticCategory[] = [
  {
    title: "Negative",
    description: "Semantic data vis colors to be used for error, alert, rejected, failed, and other adjacent states.",
    variant: "negative",
    hues: [
      { label: "Hue one", shade: 100, accessibleOnlyWithBorder: true },
      { label: "Hue two", shade: 200 }
    ]
  },
  {
    title: "Attention",
    description:
      "Semantic data vis colors to be used for marking something as cautionary, or warning of need for review.",
    variant: "attention",
    hues: [
      { label: "Hue one", shade: 100, accessibleOnlyWithBorder: true },
      { label: "Hue two", shade: 200 }
    ]
  },
  {
    title: "Positive",
    description:
      "Semantic data vis colors to be used for declaring something as complete, successful, or otherwise positive.",
    variant: "positive",
    hues: [
      { label: "Hue one", shade: 100, accessibleOnlyWithBorder: true },
      { label: "Hue two", shade: 200 }
    ]
  },
  {
    title: "Neutral active",
    description:
      "Semantic data vis colors to be used for declaring something is in progress, currently active, or live.",
    variant: "neutralActive",
    hues: [
      { label: "Hue one", shade: 100, accessibleOnlyWithBorder: true },
      { label: "Hue two", shade: 200 },
      { label: "Hue three", shade: 300 }
    ]
  },
  {
    title: "Neutral passive",
    description: "Semantic data vis colors to be used for declaring something is inactive, in draft state, or passive.",
    variant: "neutralPassive",
    hues: [
      { label: "Hue one", shade: 100, accessibleOnlyWithBorder: true },
      { label: "Hue two", shade: 200 }
    ]
  }
];

const SemanticHueSwatch = ({ variant, hue }: { variant: SemanticVariant; hue: SemanticHue }) => (
  <Flex direction="column" align="center" gap={2} width="120px">
    <Box
      bg={`${variant}.${hue.shade}`}
      width="80px"
      height="80px"
      borderRadius="4px"
      borderWidth={hue.accessibleOnlyWithBorder ? "2px" : undefined}
      borderColor={hue.accessibleOnlyWithBorder ? "rgba(0, 0, 0, 0.3)" : undefined}
      borderStyle="solid"
    />
    <Box textAlign="center" minH="78px">
      <Text fontSize="300" lineHeight="500" color="neutral.800">
        {hue.label}
      </Text>
      {hue.accessibleOnlyWithBorder && (
        <Text fontSize="200" lineHeight="400" color="neutral.800" fontStyle="italic">
          (Accessible only with border)
        </Text>
      )}
    </Box>
  </Flex>
);

const SemanticCategoryRow = ({ category }: { category: SemanticCategory }) => (
  <Flex gap={8} align="flex-start" flexWrap="wrap">
    <VStack align="stretch" gap={2} flex="1" minW="280px" maxW="486px">
      <VStack align="stretch" gap={0}>
        <Text textStyle="400-bold" color="neutral.900">
          {category.title}
        </Text>
        <Text fontSize="300" color="neutral.700">
          {category.description}
        </Text>
      </VStack>
    </VStack>

    <Box
      bg="neutral.200"
      borderWidth="1px"
      borderColor="neutral.300"
      borderRadius="16px"
      px={8}
      py={8}
      flex="2"
      minW="320px"
    >
      <Flex gap={5} align="center" justify="center" flexWrap="wrap">
        {category.hues.map(hue => (
          <SemanticHueSwatch key={hue.label} variant={category.variant} hue={hue} />
        ))}
      </Flex>
    </Box>
  </Flex>
);

export const Semantic: Story = {
  render: () => (
    <Box bg="neutral.100" borderWidth="1px" borderColor="neutral.300" borderRadius="16px" p={8} boxShadow="200">
      <VStack align="stretch" gap={5}>
        <Box borderBottomWidth="1px" borderColor="neutral.300" pb={4}>
          <VStack align="stretch" gap={2}>
            <Text textStyle="600-bold" color="neutral.900">
              Semantic
            </Text>
            <Text fontSize="300" color="neutral.700">
              A set of semantic data Visualization colours to be used for Visualizations with semantic intent, such as
              status.
            </Text>
          </VStack>
        </Box>

        {semanticCategories.map(category => (
          <SemanticCategoryRow key={category.title} category={category} />
        ))}
      </VStack>
    </Box>
  )
};
