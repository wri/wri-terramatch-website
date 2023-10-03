import Button from "../Button/Button";
import Text from "../Text/Text";
import TwoByOneSection from "./TwoByOneSection";

export default {
  title: "Components/Elements/LandingPage/TwoByOneSection",
  component: TwoByOneSection
};

export const Primary = {
  render: () => (
    <TwoByOneSection.Container className="bg-black">
      <TwoByOneSection.Top className="md:py-16 md:px-20">
        <div className="h-[292px] bg-neutral-300">Video placeholder</div>
      </TwoByOneSection.Top>
      <TwoByOneSection.Bottom>
        <div className="flex max-w-[515px] flex-col items-start justify-center gap-8 py-9 px-12">
          <Text variant="text-heading-700" className="text-white">
            Access Support Today
          </Text>
          <Text variant="text-body-900" className="text-white">
            Behind TerraMatch is a team of restoration project specialists, who want to x, y, x. We are gathering a
            document of support materials to help projects prepare for upcoming applications and
          </Text>
          <Button>Launch Resource Library</Button>
        </div>
      </TwoByOneSection.Bottom>
    </TwoByOneSection.Container>
  )
};
