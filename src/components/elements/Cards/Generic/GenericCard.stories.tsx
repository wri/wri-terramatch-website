import { IconNames } from "@/components/extensive/Icon/Icon";

import Button from "../../Button/Button";
import IconButton from "../../IconButton/IconButton";
import Pill from "../../Pill/Pill";
import Text from "../../Text/Text";
import Card from "./GenericCard";

export default {
  title: "Components/Elements/Cards/GenericCard",
  component: <div />
};

export const Default = {
  render: () => (
    <Card.Container className="h-[530px] max-w-xs">
      <Card.Image imageUrl="static/media/public/images/green-leaves.webp">
        <div className="flex w-full items-start justify-between">
          <IconButton
            className="flex h-8 w-8 items-center justify-center rounded-full bg-error-500"
            iconProps={{
              name: IconNames.TRASH_CIRCLE,
              className: "fill-white",
              width: 15,
              height: 20
            }}
          />
          <Pill>Completed</Pill>
        </div>
        <Card.ImageFooter>
          <Text variant="text-body-400" className="text-white">
            Last report:
          </Text>
          <Text variant="text-body-900" className="text-white">
            24/05/2023
          </Text>
        </Card.ImageFooter>
      </Card.Image>

      <Card.Body>
        <Card.Title>Test</Card.Title>

        <Card.DataRow icon={{ name: IconNames.MAP_PIN, width: 16 }}>Country: UK</Card.DataRow>
        <Card.DataRow icon={{ name: IconNames.MAP_PIN, width: 16 }}>
          {"<strong>Date Created:</strong> 24/08/2023"}
        </Card.DataRow>
      </Card.Body>

      <Card.ActionContainer>
        <Button fullWidth variant="secondary">
          View
        </Button>
      </Card.ActionContainer>
    </Card.Container>
  )
};
